import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Profile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceTicket, setServiceTicket] = useState(null);
  const [validServiceTicket, setValidServiceTicket] = useState(true);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

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

        const serviceResponse = await axios.post(
          "http://localhost:8000/getServiceTicket",
          {
            sessionId,
            service: "profile",
          }
        );

        const { ticket } = serviceResponse.data;
        setServiceTicket(ticket);

        if (!ticket.serviceKey) {
          console.error("Ошибка: сервисный билет не содержит serviceKey!");
          throw new Error("Некорректный сервисный билет");
        }

        localStorage.setItem("serviceKey", ticket.serviceKey);

        console.log("Полученный serviceKey:", ticket.serviceKey);

        const ticketCheckResponse = await axios.post(
          "http://localhost:8000/verifyServiceTicket",
          {
            sessionId,
            service: "profile",
            serviceKey: ticket.serviceKey,
          }
        );

        if (ticketCheckResponse.status !== 200) {
          setValidServiceTicket(false);
        }
      } catch (err) {
        console.error("Ошибка проверки сессии:", err);
        setError("Сессия истекла. Пожалуйста, войдите снова.");
        setValidServiceTicket(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error || !validServiceTicket) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>
            <h2 className="text-center mb-4">Профиль пользователя</h2>
            <p className="text-center">Добро пожаловать, {username}!</p>
            {serviceTicket && (
              <div className="alert alert-info mt-3">
                Сервисный билет для профиля: {serviceTicket.serviceKey}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
