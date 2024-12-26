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
import ThemeSwitcher from './user/ThemeSwitcher ';


const CustomNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Navbar className="bg-forms w-full" expand="lg">
      <div className="container-fluid max-w-screen-xl mx-auto px-4 ">
        <Navbar.Brand as={Link} to="/" className="text-secondary-dark d-flex align-items-center">
          <FaHome size={34} className="me-2" />
          Home
        </Navbar.Brand>
        <ThemeSwitcher classname="ml-5"/>
        <h2 className="text-center text-black flex-grow-1">Get Organized Co.</h2>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            {user && (
              <Nav.Link as={Link} className=" text-black" to="/dashboard">
                <FaTachometerAlt className="ml-7  text-black" /> Dashboard
              </Nav.Link>
            )}

            {!user && (
              <>
                <Nav.Link as={Link} className=" text-black " to="/login">
                  <FaSignInAlt className="ml-2 text-black" /> Login
                </Nav.Link>
                <Nav.Link as={Link} className=" text-black" to="/register">
                  <FaUserPlus className="ml-2 text-black" /> Register
                </Nav.Link>
              </>
            )}
            {user && (
              <Nav.Link as={Link} to="/profile" className="flex items-center text-black">
                <FaUser  className="ml-3" /> Profile
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} onClick={handleLogout} className=" text-black">
                <FaSignOutAlt className="ml-4 text-black" /> Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;