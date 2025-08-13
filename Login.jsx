import React, { useState, useContext } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usernameOrEmail, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", {
        usernameOrEmail,
        password,
      });
      const token = res.data.token;
      // fetch current user
      localStorage.setItem("token", token);
      const meRes = await API.get("/users/me");
      const userData = meRes.data;
      // call context login method (it expects userData and token)
      login(userData, token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Check credentials.");
      localStorage.removeItem("token");
    }
  };

  return (
    <Card style={{ maxWidth: 480, margin: "30px auto" }}>
      <Card.Body>
        <h3 className="mb-3">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              placeholder="Username or email"
              value={usernameOrEmail}
              onChange={(e) => setU(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setP(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            <Button type="submit">Login</Button>
            <Link to="/register">Create account</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}


