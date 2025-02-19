import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RegistrationPage from "./Components/RegistrationPage";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus, FaCode } from "react-icons/fa";
import ObfuscationPage from "./Components/ObfuscationPage";

function App() {
  return (
    <Router>
      <Container>
        <Navbar
          bg="info"
          variant="dark"
          expand="lg"
          className="shadow-lg"
          style={{ borderRadius: "10px" }}
        >
          <Navbar.Brand as={Link} to="/" className="text-light ms-4">
            SQL INJECTION + OBFUSCATE CODE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/obfuscate"
                className="text-light nav-item"
              >
                <FaCode className="me-2" />
                Обфускация кода
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="text-light nav-item">
                <FaSignInAlt className="me-2" />
                Вход
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/register"
                className="text-light nav-item"
              >
                <FaUserPlus className="me-2" />
                Регистрация
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="mt-0">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/obfuscate" element={<ObfuscationPage />} />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
