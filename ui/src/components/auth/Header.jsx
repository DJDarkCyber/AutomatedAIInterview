import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const AuthHeader = () => {

  return (
    <div className="bg-gray-300">
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

          <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800 flex justify-center align-middle text-center">
            AI Interview
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  );
};

export default AuthHeader;