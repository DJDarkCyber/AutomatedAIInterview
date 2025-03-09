import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useUserActions } from "../../hooks/user.actions";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  const userActions = useUserActions();
  const navigate = useNavigate();

  const handleLogout = () => {
    userActions.logout();
    navigate("/");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" className="ml-4">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8"
              height={27}
            />
          </Link>
        </Navbar.Brand>

        <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800">
          Interview
        </Navbar.Text>

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