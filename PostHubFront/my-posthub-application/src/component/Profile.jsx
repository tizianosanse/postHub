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
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [likesUsers, setLikesUsers] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  // User info
  const [userInfo, setUserInfo] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    surname: "",
    username: "",
    bios: "",
    email: "",
    password: "",
  });
  // Modal for updating the post
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
      fetchUserInfo(userId);
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

  const fetchUserInfo = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await response.json();
      setUserInfo(data);
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
        fetchComments(post.id); // Fetch comments for each post
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
      setLikesUsers((prev) => ({ ...prev, [postId]: data }));
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
            like: !userLikes[postId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to like/unlike post ${postId}. Status: ${response.status}`
        );
      }

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

  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: updatedUser.name,
            surname: updatedUser.surname,
            username: updatedUser.username,
            bios: updatedUser.bios,

            email: updatedUser.email,
            password: updatedUser.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      setUserInfo((prev) => ({
        ...prev,
        name: updatedUser.name,
        surname: updatedUser.surname,
        username: updatedUser.username,
        email: updatedUser.email,
      }));

      setShowEditModal(false);
      setUpdatedUser({
        name: "",
        surname: "",
        username: "",
        bios: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column align-items-center mt-5 container-custom"
      >
        <Row className="w-100 justify-content-center mt-5 row-center">
          <Col xs={12} md={3} lg={3} className="scrollable-section">
            <Card className="mb-3 card-recent-likes">
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    {userInfo.avatar && (
                      <Image
                        src={userInfo.avatar}
                        roundedCircle
                        fluid
                        className="image-avatar"
                      />
                    )}
                  </Col>
                  <Col xs={9}>
                    <Card.Title>{userInfo.username}</Card.Title>
                    <Card.Text>{userInfo.email}</Card.Text>
                    <Card.Text>{userInfo.bios}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit Info
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <h4>Recent Likes</h4>
            {Object.values(likesUsers).flat().length > 0 ? (
              Object.values(likesUsers)
                .flat()
                .map((like) => (
                  <Card key={like.id} className="mb-3 card-recent-likes">
                    <Card.Body>
                      <Row>
                        <Col xs={2}>
                          {like.user.avatar && (
                            <Image
                              src={like.user.avatar}
                              roundedCircle
                              fluid
                              className="image-avatar-small"
                            />
                          )}
                        </Col>
                        <Col xs={10}>
                          <Link to={`/user/${like.user.id}`}>
                            <Card.Title>{like.user.username}</Card.Title>
                          </Link>
                          <Card.Text>Liked your post</Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
            ) : (
              <Alert variant="info">No recent likes available</Alert>
            )}
          </Col>
          <Col xs={12} md={8} lg={6} className="scrollable-section">
            <Alert variant="warning" className="alert-center">
              This is an advertisement!
            </Alert>

            {error && <Alert variant="danger">{error}</Alert>}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="mb-3 card-recent-likes">
                  <Card.Body>
                    <Row>
                      <Col xs={2}>
                        {post.user.avatar && (
                          <Image
                            src={post.user.avatar}
                            roundedCircle
                            fluid
                            className="image-avatar-medium"
                          />
                        )}
                      </Col>
                      <Col xs={10}>
                        <Card.Title>{post.user.username}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                        <Button
                          variant={
                            userLikes[post.id] ? "success" : "outline-primary"
                          }
                          className="mx-2"
                          onClick={() => handleLike(post.id)}
                        >
                          Like {likesCount[post.id] || 0}
                        </Button>
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
                          <div className="mt-3 mt-3-custom">
                            {comments[post.id] &&
                            comments[post.id].length > 0 ? (
                              comments[post.id].map((comment) => (
                                <Card
                                  key={comment.id}
                                  className="mt-2 mt-2-custom"
                                >
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
                                            className="image-avatar-small"
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
                                    <Button
                                      className="mt-5 mt-5-custom-btn"
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
                              <Alert variant="info">
                                No comments available
                              </Alert>
                            )}
                            <Form className="mt-3 mt-3-custom">
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
                                className="mt-2 mt-2-custom"
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

        {/* Modal for updating post */}
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

        {/* Modal for editing user info */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedUser.name}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedUser.surname}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      surname: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedUser.username}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>bios</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedUser.bios}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      bios: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={updatedUser.password}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="success" onClick={handleEditUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Profile;
