import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import {
  FaHome,
  FaTachometerAlt,
  FaSignInAlt,
  FaUser ,
  FaUserPlus,
  FaSignOutAlt, 
} from "react-icons/fa";
import ThemeSwitcher from '../components/ThemeSwitcher ';


const CustomNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Navbar className="bg-blue-500 w-full text-white" expand="lg">
      <div className="container-fluid max-w-screen-xl mx-auto px-4 ">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaHome size={34} className="me-2" />
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            {user && (
              <Nav.Link as={Link} to="/dashboard">
                <FaTachometerAlt className="me-1" /> Dashboard
              </Nav.Link>
            )}
            <ThemeSwitcher />
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-1" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <FaUserPlus className="me-1" /> Register
                </Nav.Link>
              </>
            )}
            {user && (
              <Nav.Link as={Link} to="/profile" className="flex items-center">
                <FaUser  className="mr-1" /> Profile
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <FaSignOutAlt className="me-1" /> Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;