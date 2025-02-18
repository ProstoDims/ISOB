import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Container,
  Alert,
  Table,
  Row,
  Col,
} from "react-bootstrap";

const API_URL = "http://localhost:8000";

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (secure = true) => {
    try {
      const endpoint = secure ? "/login" : "/unsafe-login";
      const response = await axios.post(`${API_URL}${endpoint}`, {
        login,
        password,
      });

      setServerMessage(response.data.message);
      if (response.data.user) {
        setUsers(response.data.user);
      }
      navigate("/");
    } catch (error) {
      setServerMessage(error.response?.data?.error || "Ошибка при авторизации");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{ paddingTop: "20px" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} className="mb-4">
          <Card
            className="shadow-lg p-4"
            style={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              marginTop: "20px",
            }} // Added marginTop
          >
            <Card.Body>
              <Card.Title className="text-center mb-3 text-info">
                Вход
              </Card.Title>

              {serverMessage && (
                <Alert
                  variant={
                    serverMessage === "Авторизация успешна!"
                      ? "success"
                      : "danger"
                  }
                >
                  {serverMessage}
                </Alert>
              )}

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
                <Button
                  variant="info"
                  className="w-100 mb-3 rounded-pill"
                  onClick={() => handleLogin(true)}
                  style={{
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Безопасный вход
                </Button>
                <Button
                  variant="danger"
                  className="w-100 rounded-pill"
                  onClick={() => handleLogin(false)}
                  style={{
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Небезопасный вход
                </Button>
                <div className="text-center mt-3">
                  <Link to="/register" className="text-info">
                    Нет аккаунта? Зарегистрироваться
                  </Link>
                </div>
              </Form>

              {/* Table for displaying users */}
              {users.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-3 text-center">Список пользователей:</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Телефон</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.login}</td>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.phone_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
