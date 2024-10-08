import { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Button,
  Modal,
  Form,
  Alert,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import myLogo from "../assets/1.svg";

const NavbarComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/current-user-id`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user ID");

        const data = await response.json();
        setUserId(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!userId) throw new Error("User ID not available");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: postContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to publish post");

      setPostContent("");
      handleCloseModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="navbar-custom fixed-top"
      >
        <Navbar.Brand as={Link} to="/home" className="brand-custom">
          PostHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-flex justify-content-between w-100"
        >
          <Nav className="mr-auto">
            <Button
              onClick={handleShowModal}
              className="pubb-btn d-none d-lg-inline"
            >
              Publish Post
            </Button>
            <NavDropdown
              title="Menu"
              id="basic-nav-dropdown"
              className="d-lg-none"
            >
              <NavDropdown.Item onClick={handleShowModal}>
                Publish Post
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="d-none d-lg-flex align-items-center">
            <Nav.Link as={Link} to="/profile" className="profile-link">
              Profile
            </Nav.Link>
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="logout-button ml-2"
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* Modal for creating a post */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <div className="w-100 d-flex justify-content-center">
            <Image src={myLogo} width={100} height={100} className="logo" />
          </div>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePostSubmit}>
            <Form.Group controlId="formPostContent">
              <Form.Label>Post Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="view-comm mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavbarComponent;
