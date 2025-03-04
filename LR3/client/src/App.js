import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Profile from "./Components/Profile";

function App() {
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    setSessionId(null);
    navigate("/login");
  };

  useEffect(() => {
    const allowedRoutes = ["/login", "/register"];
    if (!sessionId && !allowedRoutes.includes(window.location.pathname)) {
      navigate("/login");
    }
  }, [sessionId, navigate]);

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mt-4">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Kerberos
          </Link>
          <div className="d-flex">
            {sessionId ? (
              <>
                <Link to="/profile" className="btn btn-outline-light me-2">
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Авторизация
                </Link>
                <Link to="/register" className="btn btn-outline-light">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/login" element={<Login setSessionId={setSessionId} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {sessionId && (
        <div className="alert alert-info mt-3">Session ID: {sessionId}</div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
