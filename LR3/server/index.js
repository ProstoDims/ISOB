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
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    await pool.query(
      "INSERT INTO users (username, password_hash, secret_key) VALUES ($1, $2, $3)",
      [username, passwordHash, key]
    );
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
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const user = result.rows[0];

    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const sessionId = crypto.randomBytes(16).toString("hex");
    const tgtExpiration = Date.now() + TGT_EXPIRATION;

    await pool.query(
      "INSERT INTO sessions (session_id, username, secret_key, expiration_time) VALUES ($1, $2, $3, $4)",
      [sessionId, username, user.secret_key, tgtExpiration]
    );

    return res.status(200).json({ sessionId, expiration: tgtExpiration });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Ошибка при аутентификации" });
  }
});

app.post("/verify", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM sessions WHERE session_id = $1",
      [sessionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Сессия не найдена" });
    }

    const session = result.rows[0];

    if (Date.now() > session.expiration_time) {
      return res.status(401).json({ message: "Сессия истекла" });
    }

    return res
      .status(200)
      .json({ message: "Сессия действительна", username: session.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Ошибка при проверке сессии" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
