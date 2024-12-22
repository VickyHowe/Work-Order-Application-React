import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import PropTypes from "prop-types"; 

const CustomNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Navbar className="bg-blue-500" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          Work Order App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            {user && (
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            )}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}

            {user && (
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            )}
            {user && (
              <Button variant="link" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

// Define prop types for CustomNavbar
CustomNavbar.propTypes = {
  user: PropTypes.object, // Define user as an object (or specify a more specific shape if needed)
  onLogout: PropTypes.func.isRequired, // Define onLogout as a required function
};

export default CustomNavbar;
