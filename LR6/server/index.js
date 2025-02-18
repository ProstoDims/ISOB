import express, { json } from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "11112222",
  database: "mydb",
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM user_profile WHERE login = $1 AND password = $2",
      [login, password]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Авторизация успешна!", user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Неверные учетные данные" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/register", async (req, res) => {
  const { login, password, first_name, last_name, phone_number } = req.body;
  try {
    await pool.query(
      "INSERT INTO user_profile (login, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5)",
      [login, password, first_name, last_name, phone_number]
    );
    res.json({ message: "Регистрация успешна!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/unsafe-login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const query = `SELECT * FROM user_profile WHERE login = '${login}' AND password = '${password}'`;
    console.log(query);
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.json({ message: "Авторизация успешна!", user: result.rows });
    } else {
      res.status(401).json({ error: "Неверные учетные данные" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/unsafe-register", async (req, res) => {
  const { login, password, first_name, last_name, phone_number } = req.body;
  try {
    const query = `INSERT INTO user_profile (login, password, first_name, last_name, phone_number) VALUES ('${login}', '${password}', '${first_name}', '${last_name}', '${phone_number}')`;
    await pool.query(query);
    res.json({ message: "Регистрация успешна!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(8000, () => console.log("Сервер запущен на порту 8000"));
