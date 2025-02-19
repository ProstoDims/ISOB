import express, { json } from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
import babel from "@babel/core";
import JavaScriptObfuscator from "javascript-obfuscator";

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

app.post("/obfuscate", (req, res) => {
  const { code, level } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  let options = {};

  switch (level) {
    case "low":
      options = {
        compact: true,
        controlFlowFlattening: false,
        renameGlobals: false,
        deadCodeInjection: false,
      };
      break;
    case "medium":
      options = {
        compact: true,
        controlFlowFlattening: true,
        renameGlobals: true,
        deadCodeInjection: false,
        stringArray: true,
        stringArrayEncoding: ["base64"],
      };
      break;
    case "high":
      options = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1,
        debugProtection: true,
        debugProtectionInterval: 0,
      };

      break;
    default:
      return res.status(400).json({ error: "Invalid obfuscation level" });
  }

  try {
    const transpiledCode = babel.transformSync(code, {
      presets: ["@babel/preset-react"],
    }).code;

    const obfuscatedCode = JavaScriptObfuscator.obfuscate(
      transpiledCode,
      options
    ).getObfuscatedCode();

    res.json({ obfuscatedCode });
  } catch (error) {
    console.error("Ошибка при обфускации:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => console.log("Сервер запущен на порту 8000"));
