import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Profile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      setError("Сессия не найдена. Пожалуйста, войдите.");
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const response = await axios.post("http://localhost:8000/verify", {
          sessionId,
        });
        setUsername(response.data.username);
      } catch (err) {
        setError("Сессия истекла. Пожалуйста, войдите снова.");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>
            <h2 className="text-center mb-4">Профиль пользователя</h2>
            <p className="text-center">Добро пожаловать, {username}!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
