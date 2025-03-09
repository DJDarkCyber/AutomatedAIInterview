import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomeHeader = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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

          {/* Headline in the middle */}
          <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800">
            AI Interview
          </Navbar.Text>

          {/* Options on the right */}
          <Nav className="ml-auto mr-4">
            <Nav.Link href="#" className="text-gray-700 hover:text-blue-600">
                <Link to="login/">Login</Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default HomeHeader;