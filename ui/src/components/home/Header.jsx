import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const HomeHeader = () => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  const isAuthenticated = !!authData?.access;
  const userRole = authData?.user?.role;

  return (
    <div className="bg-gray-300">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="ml-4">
            <img
              src="logo.png"
              alt="Logo"
              className="h-8"
              height={27}
            />
          </Navbar.Brand>

          <Navbar.Text className="mx-auto text-2xl font-bold text-gray-800 flex justify-center align-middle text-center">
            AI Interview
          </Navbar.Text>

          <Nav className="ml-auto mr-4">
            {isAuthenticated ? (
              userRole === "MODERATOR" ? (
                <Link to="/dashboard">
                  <Button
                    ripple
                    className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/interview">
                  <Button
                    ripple
                    className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  >
                    Interview
                  </Button>
                </Link>
              )
            ) : (
              <Link to="/login">
                <Button
                  ripple
                  className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                >
                  Login
                </Button>
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default HomeHeader;