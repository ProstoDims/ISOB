import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mt-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Kerberos
            </Link>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-light me-2">
                Авторизация
              </Link>
              <Link to="/register" className="btn btn-outline-light">
                Регистрация
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />

          <Route
            path="/login"
            element={<Login setSessionId={setSessionId} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>

        {sessionId && (
          <div className="alert alert-info mt-3">Session ID: {sessionId}</div>
        )}
      </div>
    </Router>
  );
}

export default App;
