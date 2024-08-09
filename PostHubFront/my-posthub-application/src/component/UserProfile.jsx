import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Image,
} from "react-bootstrap";
import myBannerImage from "../assets/banner.svg";

const UserProfile = () => {
  const { userId } = useParams();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserIdAndPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        // Fetch logged-in user's ID
        const loggedInUserIdResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/current-user-id`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!loggedInUserIdResponse.ok)
          throw new Error("Error fetching user ID");

        const loggedInUserIdData = await loggedInUserIdResponse.json();
        setLoggedInUserId(loggedInUserIdData);

        // Fetch user profile information
        const userInfoResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userInfoResponse.ok) throw new Error("Error fetching user info");

        const userInfoData = await userInfoResponse.json();
        setUserInfo(userInfoData);

        // Fetch posts for the profile user
        const postsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!postsResponse.ok) throw new Error("Error fetching posts");

        const postsData = await postsResponse.json();
        setPosts(postsData);

        // Fetch likes for each post
        postsData.forEach((post) => {
          fetchLikes(post.id);
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserIdAndPosts();
  }, [userId]);

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

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

      if (!response.ok)
        throw new Error(`Error fetching comments for post ${postId}`);

      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchLikes = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

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

      if (!response.ok)
        throw new Error(`Error fetching likes for post ${postId}`);

      const data = await response.json();
      setLikesCount((prev) => ({ ...prev, [postId]: data.length }));
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
      if (newVisibility) fetchComments(postId); // Fetch comments only when visibility is toggled
      return { ...prev, [postId]: newVisibility };
    });
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment((prev) => ({ ...prev, [postId]: value }));
  };

  const handleNewCommentSubmit = async (postId) => {
    try {
      if (!loggedInUserId) throw new Error("User ID not available");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/comments/${loggedInUserId}/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment[postId] || "" }),
        }
      );

      if (!response.ok)
        throw new Error(`Error posting comment for post ${postId}`);

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column mt-5"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100">
        <Col xs={12} md={4} lg={3} className="sticky-top mt-5">
          <Card className="mb-4">
            <Card.Body className="text-center">
              {userInfo?.avatar && (
                <Image
                  src={userInfo.avatar}
                  roundedCircle
                  fluid
                  style={{ maxWidth: "150px" }}
                />
              )}
              <Card.Title className="mt-3">{userInfo?.username}</Card.Title>
              <Card.Text>{userInfo?.email}</Card.Text>
              <Card.Text>{userInfo?.bios}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col
          xs={12}
          md={8}
          lg={9}
          className="scrollable-section "
          style={{ maxHeight: "calc(100vh - 56px)" }}
        >
          <Alert className="banner alert-center">
            <Image
              src={myBannerImage}
              alt="Advertisement Banner"
              fluid
              className="w-100"
            />
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
                        </Link>
                        {post.user.avatar && (
                          <Image
                            src={post.user.avatar}
                            roundedCircle
                            fluid
                            style={{ maxWidth: "30px", marginLeft: "10px" }}
                          />
                        )}
                      </Card.Title>
                      <Card.Text>{post.content}</Card.Text>
                      <Button
                        className={
                          userLikes[post.id]
                            ? "btn-like-ye mr-2"
                            : "btn-like-no mr-2"
                        }
                        onClick={() => handleLike(post.id)}
                      >
                        {likesCount[post.id] || 0} Likes
                      </Button>
                      <Button
                        className=" view-comm mx-4"
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
                                      className="d-flex align-items-center justify-content-center"
                                    >
                                      {comment.user.avatar && (
                                        <Image
                                          src={comment.user.avatar}
                                          roundedCircle
                                          fluid
                                          style={{ maxWidth: "30px" }}
                                        />
                                      )}
                                    </Col>
                                    <Col xs={10}>
                                      <Link to={`/user/${comment.user.id}`}>
                                        {comment.user.username}
                                      </Link>
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
                          <Form.Group className="mt-3">
                            <Form.Control
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment[post.id] || ""}
                              onChange={(e) =>
                                handleNewCommentChange(post.id, e.target.value)
                              }
                            />
                            <Button
                              variant="primary"
                              className=" post-comm mt-2"
                              onClick={() => handleNewCommentSubmit(post.id)}
                            >
                              post comment
                            </Button>
                          </Form.Group>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
