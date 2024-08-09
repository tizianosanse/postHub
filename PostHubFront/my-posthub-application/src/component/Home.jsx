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
import myBannerImage from "../assets/banner.svg";

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
        [postId]: !!userLike,
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
      className="d-flex flex-column align-items-center mt-5"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100 justify-content-center mt-5">
        <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
          <Alert className="banner p-0">
            <Image
              src={myBannerImage}
              alt="Advertisement Banner"
              fluid
              className="w-100"
            />
          </Alert>
        </Col>

        <Col xs={12} md={8} lg={6}>
          {error && <Alert variant="danger">{error}</Alert>}
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col xs={10} className="scrollable-section ">
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
                        className={
                          userLikes[post.id]
                            ? "btn-like-ye mx-2"
                            : "btn-like-no mx-2"
                        }
                        onClick={() => handleLike(post.id)}
                      >
                        {likesCount[post.id] || 0} Likes
                      </Button>
                      <Button
                        className="view-comm mx-4"
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
                            <Alert className="alert-comm">
                              No comments available
                            </Alert>
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
                              className=" post-comm mt-2"
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
            <Alert className="alert-comm">No posts available</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
