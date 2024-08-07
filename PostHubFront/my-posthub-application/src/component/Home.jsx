import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  Button,
  Form,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    fetchUserId();
    fetchPosts();
  }, []);

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

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

      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }

      const data = await response.json();
      setUserId(data);
    } catch (error) {
      setError(error.message);
    }
  };

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
      setPosts(data.content);
      data.content.forEach((post) => {
        fetchLikes(post.id);
        checkUserLike(post.id);
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch likes for post ${postId}`);
      }

      const data = await response.json();
      setLikesCount((prev) => ({ ...prev, [postId]: data.length }));
    } catch (error) {
      setError(error.message);
    }
  };

  const checkUserLike = async (postId) => {
    try {
      if (!userId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch likes for post ${postId}`);
      }

      const data = await response.json();
      const userLike = data.find((like) => like.user.id === userId);

      setUserLikes((prev) => ({
        ...prev,
        [postId]: !!userLike, // True if user liked the post, false otherwise
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (!userId) {
        throw new Error("User ID non disponibile");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/likes/${userId}/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            like: !userLikes[postId], // Toggle like status
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to like/unlike post ${postId}. Status: ${response.status}`
        );
      }

      // Update the local state to reflect the like/unlike action
      setLikesCount((prev) => ({
        ...prev,
        [postId]: userLikes[postId] ? prev[postId] - 1 : prev[postId] + 1,
      }));

      setUserLikes((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prev) => {
      const newVisibility = !prev[postId];
      if (newVisibility) {
        fetchComments(postId); // Fetch comments only when visibility is toggled
      }
      return { ...prev, [postId]: newVisibility };
    });
  };

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comment`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch comments for post ${postId}`);
      }

      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment((prev) => ({ ...prev, [postId]: value }));
  };

  const handleNewCommentSubmit = async (postId) => {
    try {
      if (!userId) {
        throw new Error("User ID non disponibile");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trovato");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${userId}/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newComment[postId] || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to post comment for post ${postId}`);
      }

      // Clear the comment input field
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      // Refetch comments
      fetchComments(postId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center mt-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Alert variant="warning" className="text-center m-5">
            Questo è un annuncio pubblicitario!
          </Alert>

          {error && <Alert variant="danger">{error}</Alert>}
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col xs={10}>
                      <Card.Title className="d-flex align-items-center">
                        <Link
                          to={`/user/${post.user.id}`}
                          className="d-flex align-items-center"
                        >
                          {post.user.username}
                          {post.user.avatar && (
                            <Image
                              src={post.user.avatar}
                              roundedCircle
                              fluid
                              style={{ maxWidth: "30px", marginLeft: "10px" }}
                            />
                          )}
                        </Link>
                      </Card.Title>
                      <Card.Text>{post.content}</Card.Text>
                      <Button
                        variant={
                          userLikes[post.id] ? "success" : "outline-primary"
                        }
                        className="mr-2"
                        onClick={() => handleLike(post.id)}
                      >
                        {likesCount[post.id] || 0} Likes
                      </Button>
                      <Button
                        className="mx-4"
                        variant="primary"
                        onClick={() => toggleCommentsVisibility(post.id)}
                      >
                        {visibleComments[post.id]
                          ? "Hide Comments"
                          : "View Comments"}
                      </Button>
                      {visibleComments[post.id] && (
                        <div className="mt-3">
                          {comments[post.id] && comments[post.id].length > 0 ? (
                            comments[post.id].map((comment) => (
                              <Card key={comment.id} className="mt-2">
                                <Card.Body>
                                  <Row>
                                    <Col
                                      xs={2}
                                      className="d-flex align-items-center"
                                    >
                                      {comment.user.avatar && (
                                        <Image
                                          src={comment.user.avatar}
                                          roundedCircle
                                          fluid
                                          style={{ maxWidth: "40px" }}
                                        />
                                      )}
                                    </Col>
                                    <Col xs={10}>
                                      <Card.Title>
                                        <Link to={`/user/${comment.user.id}`}>
                                          {comment.user.username}
                                        </Link>
                                      </Card.Title>
                                      <Card.Text>{comment.content}</Card.Text>
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            ))
                          ) : (
                            <Alert variant="info">No comments available</Alert>
                          )}
                          <Form className="mt-3">
                            <Form.Group>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Add a comment..."
                                value={newComment[post.id] || ""}
                                onChange={(e) =>
                                  handleNewCommentChange(
                                    post.id,
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                            <Button
                              className="mt-2"
                              variant="primary"
                              onClick={() => handleNewCommentSubmit(post.id)}
                            >
                              Post Comment
                            </Button>
                          </Form>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No posts available</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
