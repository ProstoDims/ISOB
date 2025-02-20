import express from "express";
import pkg from "pg";
import crypto from "crypto";
import cors from "cors";

const { Pool } = pkg;

const dbConfig = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "11112222",
  database: "mydb",
};

const pool = new Pool(dbConfig);

const app = express();
app.use(cors());
app.use(express.json());

const TGT_EXPIRATION = 30 * 60 * 1000;

const generateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = hashPassword(password);
  const key = generateKey();

  try {
    console.log(`Пытаемся зарегистрировать пользователя: ${username}`);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      console.log(`Пользователь с именем ${username} уже существует`);
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    await pool.query(
      "INSERT INTO users (username, password_hash, secret_key) VALUES ($1, $2, $3)",
      [username, passwordHash, key]
    );
    console.log(`Пользователь ${username} зарегистрирован`);
    return res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Ошибка при регистрации" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = hashPassword(password);

  try {
    console.log(`Пытаемся войти пользователю: ${username}`);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      console.log(`Пользователь с именем ${username} не найден`);
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const user = result.rows[0];

    if (user.password_hash !== passwordHash) {
      console.log(`Неверный пароль для пользователя: ${username}`);
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const sessionId = crypto.randomBytes(16).toString("hex");
    const tgtExpiration = Date.now() + TGT_EXPIRATION;

    await pool.query(
      "INSERT INTO sessions (session_id, username, secret_key, expiration_time) VALUES ($1, $2, $3, $4)",
      [sessionId, username, user.secret_key, tgtExpiration]
    );
    console.log(`Пользователь ${username} успешно вошел в систему`);
    return res.status(200).json({ sessionId, expiration: tgtExpiration });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Ошибка при аутентификации" });
  }
});

app.post("/verify", async (req, res) => {
  const { sessionId } = req.body;

  try {
    console.log(`Проверка сессии с ID: ${sessionId}`);
    const result = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId]
    );
    if (result.rows.length === 0) {
      console.log(`Сессия с ID ${sessionId} не найдена`);
      return res.status(404).json({ message: "Сессия не найдена" });
    }

    const session = result.rows[0];

    if (Date.now() > session.expiration_time) {
      console.log(`Сессия с ID ${sessionId} истекла`);
      return res.status(401).json({ message: "Сессия истекла" });
    }

    console.log(`Сессия с ID ${sessionId} действительна`);
    return res
      .status(200)
      .json({ message: "Сессия действительна", username: session.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Ошибка при проверке сессии" });
  }
});

app.post("/getServiceTicket", async (req, res) => {
  const { sessionId, service } = req.body;

  try {
    console.log(
      `Запрос сервисного билета для сессии ${sessionId} и сервиса ${service}`
    );

    const result = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId]
    );

    if (result.rows.length === 0) {
      console.log(`Сессия с ID ${sessionId} не найдена`);
      return res.status(404).json({ message: "Сессия не найдена" });
    }

    const session = result.rows[0];

    if (Date.now() > session.expiration_time) {
      console.log(`Сессия с ID ${sessionId} истекла`);
      return res.status(401).json({ message: "Сессия истекла" });
    }

    const ticketResult = await pool.query(
      "SELECT * FROM service_tickets WHERE session_id = $1 AND service = $2",
      [sessionId, service]
    );

    let serviceTicket;

    if (ticketResult.rows.length > 0) {
      let ticketData = ticketResult.rows[0].ticket_data;
      if (typeof ticketData === "string") {
        serviceTicket = JSON.parse(ticketData);
      } else {
        serviceTicket = ticketData;
      }

      if (Date.now() > serviceTicket.expirationTime) {
        console.log(
          `Сервисный билет для сервиса ${service} истёк, обновляем...`
        );
        serviceTicket.serviceKey = crypto.randomBytes(32).toString("hex");
        serviceTicket.expirationTime = Date.now() + TGT_EXPIRATION;

        await pool.query(
          "UPDATE service_tickets SET ticket_data = $1 WHERE session_id = $2 AND service = $3",
          [JSON.stringify(serviceTicket), sessionId, service]
        );
        console.log(`Сервисный билет для сервиса ${service} обновлён`);
      }
    } else {
      serviceTicket = {
        sessionId,
        service,
        expirationTime: Date.now() + TGT_EXPIRATION,
        serviceKey: crypto.randomBytes(32).toString("hex"),
      };

      await pool.query(
        "INSERT INTO service_tickets (session_id, service, ticket_data) VALUES ($1, $2, $3)",
        [sessionId, service, JSON.stringify(serviceTicket)]
      );
      console.log(`Сервисный билет для сервиса ${service} выдан`);
    }

    return res
      .status(200)
      .json({ message: "Сервисный билет выдан", ticket: serviceTicket });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Ошибка при запросе сервисного билета" });
  }
});

app.post("/verifyServiceTicket", async (req, res) => {
  const { sessionId, service, serviceKey } = req.body;

  try {
    console.log(
      `Проверка сервисного билета для сессии ${sessionId} и сервиса ${service}`
    );

    const ticketResult = await pool.query(
      "SELECT * FROM service_tickets WHERE session_id = $1 AND service = $2",
      [sessionId, service]
    );

    if (ticketResult.rows.length === 0) {
      console.log(`Сервисный билет для сервиса ${service} не найден`);
      return res.status(404).json({ message: "Сервисный билет не найден" });
    }

    let serviceTicket;
    try {
      serviceTicket =
        typeof ticketResult.rows[0].ticket_data === "string"
          ? JSON.parse(ticketResult.rows[0].ticket_data)
          : ticketResult.rows[0].ticket_data;
    } catch (error) {
      console.error("Ошибка парсинга ticket_data:", error);
      return res
        .status(500)
        .json({ message: "Ошибка в данных сервисного билета" });
    }

    if (!serviceTicket.serviceKey) {
      console.error("Ошибка: serviceKey отсутствует в билетe!");
      return res
        .status(500)
        .json({ message: "Ошибка в данных сервисного билета" });
    }

    console.log("Получен ключ на сервере:", serviceKey);
    console.log("Сохраненный ключ в базе данных:", serviceTicket.serviceKey);

    if (serviceTicket.serviceKey !== serviceKey) {
      console.log(`Неверный ключ для сервиса ${service}`);
      return res.status(401).json({ message: "Неверный ключ для сервиса" });
    }

    console.log(`Доступ разрешен для сервиса ${service}`);
    return res.status(200).json({ message: "Доступ разрешен" });
  } catch (err) {
    console.error("Ошибка при проверке сервисного билета:", err);
    return res
      .status(500)
      .json({ message: "Ошибка при проверке сервисного билета" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
