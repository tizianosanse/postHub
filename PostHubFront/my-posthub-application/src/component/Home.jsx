import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, ListGroup } from "react-bootstrap";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token non trovato");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log("Posts Data:", data); // Log dei dati per verifica

        // Estrai l'array di post dalla risposta
        if (data && data.content && Array.isArray(data.content)) {
          setPosts(data.content);
        } else {
          setError("Formato dati non valido");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          <ListGroup>
            {posts.length > 0 ? (
              posts.map((post) => (
                <ListGroup.Item key={post.id}>
                  <h5>{post.user.username}</h5>
                  <p>{post.content}</p>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No posts available</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
