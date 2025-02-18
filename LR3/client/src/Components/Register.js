import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/register", {
        username,
        password,
      });

      setSuccess(true);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>
            <h2 className="text-center mb-4">Регистрация</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Логин
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 my-3"
                disabled={loading}
                style={{
                  borderRadius: "25px",
                  transition: "background-color 0.3s ease",
                }}
              >
                {loading ? "Загрузка..." : "Зарегистрироваться"}
              </button>
            </form>
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                Регистрация прошла успешно!
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
