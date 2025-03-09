import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useUserActions } from "../../hooks/user.actions"; // Import useUserActions
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Header = () => {
  const userActions = useUserActions(); // Access user actions
  const navigate = useNavigate(); // For navigation

  // Handle logout
  const handleLogout = () => {
    userActions.logout(); // Call the logout function
    navigate("/"); // Redirect to the home page
  };

  return (
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
          Interview
        </Navbar.Text>

        {/* Logout button on the right */}
        <Nav className="ml-auto mr-4">
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
  );
};

export default Header;