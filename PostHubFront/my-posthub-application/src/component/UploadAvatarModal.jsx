/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";

const UploadAvatarModal = ({ show, onHide, userId, refreshProfile }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/avatar/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload avatar");
      }

      const { url } = await uploadResponse.json();

      const updateResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/avatar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update avatar URL");
      }

      refreshProfile();
      onHide();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Select File</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadAvatarModal;
