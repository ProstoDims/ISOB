import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Container } from "react-bootstrap";
import { FaCopy, FaCode, FaDownload } from "react-icons/fa";

const API_URL = "http://localhost:8000";

function ObfuscationPage() {
  const [code, setCode] = useState("");
  const [obfuscatedCode, setObfuscatedCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [obfuscationLevel, setObfuscationLevel] = useState("medium");

  const handleObfuscate = async () => {
    try {
      const response = await axios.post(`${API_URL}/obfuscate`, {
        code,
        level: obfuscationLevel,
      });
      setObfuscatedCode(response.data.obfuscatedCode);
    } catch (error) {
      alert("Ошибка при обфускации кода");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(obfuscatedCode);
    alert("Код скопирован!");
  };

  const handleDownload = () => {
    const blob = new Blob([obfuscatedCode], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "obfuscated_code.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-90 bg-light mt-5">
      <Card
        className="shadow-lg p-4"
        style={{
          width: "60rem",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-3 text-info">
            <FaCode className="me-2" />
            Обфускация кода
          </Card.Title>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Загрузите файл с кодом:</Form.Label>
              <Form.Control
                type="file"
                accept=".js,.txt"
                onChange={handleFileUpload}
              />
            </Form.Group>

            <Form.Group controlId="formCode" style={{ marginBottom: "50px" }}>
              <Form.Label>Введите код:</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                placeholder="Введите код или загрузите файл..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-3"
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#f8f9fa",
                  width: "100%",
                  minHeight: "300px",
                }}
              />
            </Form.Group>

            <Form.Group controlId="formObfuscationLevel" className="mb-3">
              <Form.Label>Уровень обфускации:</Form.Label>
              <Form.Select
                value={obfuscationLevel}
                onChange={(e) => setObfuscationLevel(e.target.value)}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </Form.Select>
            </Form.Group>

            <Button
              variant="info"
              className="w-100 mb-3 rounded-pill"
              onClick={handleObfuscate}
              style={{ transition: "background-color 0.3s ease" }}
            >
              Обфусцировать
            </Button>

            {obfuscatedCode && (
              <Form.Group
                controlId="formObfuscatedCode"
                style={{ marginBottom: "50px" }}
              >
                <Form.Label>Результат:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={obfuscatedCode}
                  readOnly
                  className="mb-3"
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#e9ecef",
                    width: "100%",
                    minHeight: "300px",
                  }}
                />
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    className="w-50 rounded-pill"
                    onClick={handleCopy}
                  >
                    <FaCopy className="me-2" />
                    Скопировать
                  </Button>
                  <Button
                    variant="primary"
                    className="w-50 rounded-pill"
                    onClick={handleDownload}
                  >
                    <FaDownload className="me-2" />
                    Скачать файл
                  </Button>
                </div>
              </Form.Group>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ObfuscationPage;
