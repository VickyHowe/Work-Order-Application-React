import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const CustomNavbar = ({ user, onLogout }) => {
  return (
    <Navbar className="bg-blue-500" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          Work Order App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" active>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
            {/* Only render the Profile link if the user is logged in */}
            {user && (
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            )}
            {user && (
              <Button variant="link" onClick={onLogout}>Logout</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
