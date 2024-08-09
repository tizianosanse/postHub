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

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [bios, setBios] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            surname,
            username,
            bios,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registrazione fallita. Riprova.");
      }

      setSuccess(
        "Registrazione avvenuta con successo. Puoi ora effettuare il login."
      );
      setError(null);
      // Reset form fields
      setName("");
      setSurname("");
      setUsername("");
      setBios("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100 bg-light-gray"
    >
      <Row className="justify-content-center w-100">
        <Col
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={4}
          className="scrollable-form-hidden"
        >
          <Form
            onSubmit={handleSubmit}
            className="p-4 border rounded bg-white shadow scrollable-form"
          >
            <div className="d-flex justify-content-center mb-3">
              <Image src={myLogo} width={80} height={80} className="logo" />
            </div>
            <Form.Group controlId="formName" className="mb-2">
              <Form.Label className="small">Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formSurname" className="mb-2">
              <Form.Label className="small">Cognome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo cognome"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername" className="mb-2">
              <Form.Label className="small">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formBios" className="mb-2">
              <Form.Label className="small">Bios</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci una breve descrizione"
                value={bios}
                onChange={(e) => setBios(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-2">
              <Form.Label className="small">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-2">
              <Form.Label className="small">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label className="small">Conferma Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Conferma la tua password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control-sm"
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button type="submit" className="regist-btn mb-2 btn-sm w-100">
              Registrati
            </Button>
            <Button
              className="login-btn btn-sm w-100"
              onClick={() => navigate("/login")}
            >
              Torna al login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
