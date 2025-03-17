import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  setUsername,
  setUserLoginStatus,
  setUserProfileName,
  setUserPicture,
  setUserOnlineStatus,
  setUserPhoneNumber,
} from "../redux/actions/index";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutAPI } from "../services/api";
import logo from "../assets/images/logo.png";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer);

  console.log("User:", user);

  const handleLogout = async (e) => {
    e.preventDefault();

    const data = {
      email: user.username,
    };

    console.log("Data:", data);

    const response = await logOutAPI(data);

    // TODO:

    if (response.status === 200) {
      dispatch(setUsername(""));
      dispatch(setUserLoginStatus(false));
      dispatch(setUserProfileName(""));
      dispatch(setUserOnlineStatus("offline"));
      dispatch(setUserPhoneNumber(""));
      dispatch(setUserPicture(""));

      navigate("/login");
    }
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} style={{ width: 50, height: 50 }} />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user.isLoggedIn && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            {!user.isLoggedIn && (
              <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            {user.isLoggedIn && (
              <NavDropdown
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    {user.name}
                  </>
                }
                id="basic-nav-dropdown"
              >

                <NavDropdown.Item>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
