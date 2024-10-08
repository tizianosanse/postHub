import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Image,
} from "react-bootstrap";
import myLogo from "../assets/1.svg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Login fallito. Controlla le tue credenziali e riprova."
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6} xl={4}>
          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded bg-white shadow"
          >
            <div className="d-flex justify-content-center mb-4">
              <Image src={myLogo} width={100} height={100} className="logo" />
            </div>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" className="login-btn mt-3 w-100">
              Login
            </Button>
            <Button
              className="regist-btn mt-2 w-100"
              onClick={() => navigate("/register")}
            >
              Registrati
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
