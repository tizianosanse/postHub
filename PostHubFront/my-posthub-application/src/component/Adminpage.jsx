import { useState, useEffect } from "react";
import { Button, Alert, Card } from "react-bootstrap";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.content); // Adjust according to the API response structure
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      // Remove deleted user from the list
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <h1>Admin Page</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-3" key={user.id}>
            <Card>
              <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {user.name}
                </Card.Subtitle>{" "}
                <Card.Subtitle className="mb-2 text-muted">
                  {user.surname}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  {user.email}
                </Card.Subtitle>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete User
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
