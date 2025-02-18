import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import RegistrationPage from "./Components/RegistrationPage";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

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
            SQL INJECTION
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
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
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
