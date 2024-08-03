import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [likesCount, setLikesCount] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Modale per aggiornamento del post
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
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

  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/posts`,
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
      setPosts(data);
      data.forEach((post) => {
        fetchLikes(post.id);
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
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

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
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

  // eslint-disable-next-line no-unused-vars
  const handleLike = async (postId) => {
    try {
      if (!userId) {
        throw new Error("User ID not available");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const likeResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/likes/${userId}/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            like: true,
          }),
        }
      );

      if (!likeResponse.ok) {
        throw new Error(
          `Failed to like post ${postId}. Status: ${likeResponse.status}`
        );
      }

      setLikesCount((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments((prev) => {
      const newVisibility = !prev[postId];
      if (newVisibility) {
        fetchComments(postId);
      }
      return { ...prev, [postId]: newVisibility };
    });
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment((prev) => ({ ...prev, [postId]: value }));
  };

  const handleNewCommentSubmit = async (postId) => {
    try {
      if (!userId) {
        throw new Error("User ID not available");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
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

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete post ${postId}`);
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment ${commentId}`);
      }

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdatePost = (post) => {
    setCurrentPost(post);
    setUpdatedContent(post.content);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    if (!currentPost) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${currentPost.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: updatedContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // Update the post in the state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === currentPost.id
            ? { ...post, content: updatedContent }
            : post
        )
      );

      setShowModal(false);
      setCurrentPost(null);
      setUpdatedContent("");
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
            This is an advertisement!
          </Alert>

          {error && <Alert variant="danger">{error}</Alert>}
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.user.username}</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                  <Button
                    variant="outline-success"
                    className="update-btn"
                    onClick={() => handleUpdatePost(post)}
                  >
                    Update Post
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete Post
                  </Button>
                  <Button
                    className="mx-2"
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
                              <Card.Title>{comment.user.username}</Card.Title>
                              <Card.Text>{comment.content}</Card.Text>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteComment(comment.id, post.id)
                                }
                              >
                                Remove Comment
                              </Button>
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
                              handleNewCommentChange(post.id, e.target.value)
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
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No posts available</Alert>
          )}
        </Col>
      </Row>

      {/* Modale per aggiornamento del post */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Post Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
