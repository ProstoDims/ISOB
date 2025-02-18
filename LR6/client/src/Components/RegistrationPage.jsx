import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Form, Container } from "react-bootstrap";

const API_URL = "http://localhost:8000";

function RegistrationPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (secure = true) => {
    try {
      const endpoint = secure ? "/register" : "/unsafe-register";
      const response = await axios.post(`${API_URL}${endpoint}`, {
        login,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });
      alert(response.data.message);
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Ошибка при регистрации");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card
        className="shadow-lg p-4"
        style={{
          width: "30rem",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-3 text-info">
            Регистрация
          </Card.Title>
          <Form>
            <Form.Group controlId="formLogin">
              <Form.Control
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Control
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Control
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Control
                type="text"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            <Button
              variant="info"
              className="w-100 mb-3 rounded-pill"
              onClick={() => handleRegister(true)}
              style={{
                transition: "background-color 0.3s ease",
              }}
            >
              Безопасная регистрация
            </Button>
            <Button
              variant="danger"
              className="w-100 rounded-pill"
              onClick={() => handleRegister(false)}
              style={{
                transition: "background-color 0.3s ease",
              }}
            >
              Небезопасная регистрация
            </Button>
            <div className="text-center mt-3">
              <Link to="/" className="text-info">
                Есть аккаунт? Войти
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegistrationPage;
