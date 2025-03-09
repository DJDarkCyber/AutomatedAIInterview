import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useUserActions } from "../../hooks/user.actions"; // Import useUserActions
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Header = ({ onEmployerCreated }) => {
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    field_of_interview: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState(""); // Generated password
  const [error, setError] = useState(null); // Error state

  const userActions = useUserActions(); // Access user actions
  const navigate = useNavigate(); // For navigation

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Prepare the data for the API request
      const payload = {
        ...formData,
        role: "EMPLOYER",
        password: "dummypass", // Set a dummy password
      };

      // Send the POST request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Show the generated password to the user
      setGeneratedPassword(response.data.password);
      setError(null); // Clear any previous errors

      // Invoke the callback to refresh the employer list
      if (onEmployerCreated) {
        onEmployerCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

  // Close the modal and reset the form
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      field_of_interview: "",
    });
    setGeneratedPassword("");
    setError(null);
  };

  // Handle logout
  const handleLogout = () => {
    userActions.logout(); // Call the logout function
    navigate("/"); // Redirect to the home page
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          {/* Logo on the left */}
          <Navbar.Brand href="#" className="ml-4">
            <img
              src="https://via.placeholder.com/150x50?text=Logo" // Replace with your logo
              alt="Logo"
              className="h-8"
            />
          </Navbar.Brand>

          {/* Headline in the center */}
          <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800">
            Moderator Dashboard
          </Navbar.Text>

          {/* "Schedule new interview" and "Logout" buttons on the right */}
          <Nav className="ml-auto mr-4">
            <Button
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700 mr-2"
              onClick={() => setShowModal(true)}
            >
              Schedule New Interview
            </Button>
            <Button
              variant="danger"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Schedule New Interview Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {generatedPassword ? (
            <>
              <Alert variant="success">
                <p>User registered successfully!</p>
                <p>
                  <strong>Password:</strong> {generatedPassword}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(generatedPassword)}
                >
                  Copy Password
                </Button>
              </Alert>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Field of Interview</Form.Label>
                <Form.Control
                  type="text"
                  name="field_of_interview"
                  value={formData.field_of_interview}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button variant="primary" type="submit">
                Schedule Interview
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;