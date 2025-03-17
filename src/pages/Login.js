import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppContext } from "../context/appContext";
import {
  setUsername,
  setUserLoginStatus,
  setUserProfileName,
  setUserPicture,
  setUserOnlineStatus,
  setUserPhoneNumber,
  setUserID,
  setUserNewMessages,
} from "../redux/actions/index";

import { loginAPI } from "../services/api";
import Styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { socket } = useContext(AppContext);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
    console.log("Login Info:", loginInfo);
  };

  const handleFormErrors = (loginInfo) => {
    console.log("Login Info:", loginInfo);
    const errors = {};

    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!loginInfo.email.trim()) {
      errors.email = "Email is required.";
    } else if (!regexEmail.test(loginInfo.email.trim())) {
      errors.email = "Invalid email format.";
    }

    const lengthRegex = /.{8,}/;

    if (!loginInfo.password.trim()) {
      errors.password = "Password is required.";
    } else if (!lengthRegex.test(loginInfo.password.trim())) {
      errors.password = "Password must be at least 8 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(handleFormErrors(loginInfo));
    setIsSubmit(true);
  };

  const loginHandler = async () => {
    const data = {
      email: loginInfo.email,
      password: loginInfo.password,
    };

    try {
      const res = await loginAPI(data);

      console.log("Response:", res);

      setLoginInfo({
        email: "",
        password: "",
      });

      dispatch(setUsername(data.email));
      dispatch(setUserLoginStatus(true));
      dispatch(setUserProfileName(res.name));
      dispatch(setUserOnlineStatus(res.status));
      dispatch(setUserPhoneNumber(res.phoneNumber));
      dispatch(setUserPicture(res.picture));
      dispatch(setUserID(res._id));
      dispatch(setUserNewMessages(res.newMessages));

      socket.emit("new-user");

      navigate("/chat");

      return;
    } catch (error) {
      console.log("Error during login process:", error);

      return;
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (isSubmit && Object.keys(formErrors).length === 0) {
      loginHandler();
    }
  }, [formErrors]);
  return (
    <Container>
      <Row>
        <Col className={Styles.loginBg} md={5}></Col>
        <Col md={7}>
          <h3>Login for Chatbot</h3>
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
            <label>Email Address</label>
            <br />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={loginInfo.email}
              required
            />
            {formErrors.email && (
              <p>
                <small>{formErrors.email}</small>
              </p>
            )}
            <br />
            <br />
            <label>Pasword</label>
            <br />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={loginInfo.password}
              required
            />
            {formErrors.password && (
              <p>
                <small>{formErrors.password}</small>
              </p>
            )}
            <br />
            <br />
            <Button variant="primary" type="submit">
              Login
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
