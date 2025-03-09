import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useUserActions } from "../../hooks/user.actions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = ({ onEmployerCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    field_of_interview: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState(null);

  const userActions = useUserActions();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const payload = {
        ...formData,
        role: "EMPLOYER",
        password: "dummypass",
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setGeneratedPassword(response.data.password);
      setError(null);

      if (onEmployerCreated) {
        onEmployerCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    }
  };

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

  const handleLogout = () => {
    userActions.logout();
    navigate("/");
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="ml-4">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8"
              />
            </Link>
          </Navbar.Brand>

          <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800">
            Moderator Dashboard
          </Navbar.Text>

          <Nav className="ml-auto mr-4">
            <Button
            variant="dark"
            style={{'borderRadius': '10px'}}
              className="rounded-full bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
              onClick={() => setShowModal(true)}
            >
              Schedule New Interview
            </Button>
            <button
              style={{'borderRadius': '10px'}}
              className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 ml-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </Nav>
        </Container>
      </Navbar>

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