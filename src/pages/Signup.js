import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SampleProfileImage from "../assets/images/sample_profile.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import { signUpAPI } from "../services/api";
import Styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    url: "",
  });

  // for handling the image related tasks
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  const [imgError, setImgError] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });

    console.log("Name & Value", name, value);
  };

  const changeImageHandler = async (e) => {
    const file = e.target.files[0];

    if (file.size >= 1048576) {
      return alert("Max image file size is 1MB");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      console.log("Image uploaded Successfully");
    }
  };

  const handleFormErrors = (signupInfo) => {
    const errors = {};

    const regexName = /^[^*|\":<>[\]{}`\\()'!#%^_+,./~?;@&$]+$/;

    if (!signupInfo.name.trim()) {
      errors.name = "Name is required.";
    } else if (!regexName.test(signupInfo.name.trim())) {
      errors.name = "Invalid characters in the name.";
    }

    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!signupInfo.email.trim()) {
      errors.email = "Email is required.";
    } else if (!regexEmail.test(signupInfo.email.trim())) {
      errors.email = "Invalid email format.";
    }

    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!signupInfo.password.trim()) {
      errors.password = "Password is required.";
    } else if (!lengthRegex.test(signupInfo.password.trim())) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!uppercaseRegex.test(signupInfo.password.trim())) {
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!lowercaseRegex.test(signupInfo.password.trim())) {
      errors.password = "Password must contain at least one lowercase letter.";
    } else if (!numberRegex.test(signupInfo.password.trim())) {
      errors.password = "Password must contain at least one number.";
    } else if (!specialCharacterRegex.test(signupInfo.password.trim())) {
      errors.password = "Password must contain at least one special character.";
    }

    if (!signupInfo.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (
      signupInfo.confirmPassword.trim() !== signupInfo.password.trim()
    ) {
      errors.confirmPassword = "Confirm password and password should be same.";
    }

    const regexNumber = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

    if (!signupInfo.mobileNumber) {
      errors.mobileNumber = "Phone number is required.";
    } else if (!regexNumber.test(signupInfo.mobileNumber)) {
      errors.mobileNumber = "Phone number is not valid.";
    }
    return errors;
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "lbeudqg4");

    try {
      setUploadingImage(true);

      let response = await fetch(
        "https://api.cloudinary.com/v1_1/daa089qma/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const urlData = await response.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (e) {
      setUploadingImage(false);
      console.log("Error in uploading image:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setImgError("Please upload profile image!");
      return;
    }

    const url = await uploadImage(image);

    setSignupInfo({
      ...signupInfo,
      url: url,
    });

    console.log("URL:", url);

    setFormErrors(handleFormErrors(signupInfo));

    setIsSubmit(true);
  };

  const signUpHandler = async () => {
    const data = {
      name: signupInfo.name,
      email: signupInfo.email,
      password: signupInfo.password,
      phoneNumber: signupInfo.mobileNumber,
      picture: signupInfo.url,
    };

    console.log("Data:", data);

    try {
      const res = await signUpAPI(data);

      console.log("Response:", res);

      if (res.status === "online") {
        setSignupInfo({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
          url: "",
        });

        dispatch(setUsername(data.email));
        dispatch(setUserLoginStatus(true));
        dispatch(setUserProfileName(data.name));
        dispatch(setUserOnlineStatus("online"));
        dispatch(setUserPhoneNumber(data.phoneNumber));
        dispatch(setUserPicture(data.picture));
        dispatch(setUserID(res._id));
        dispatch(setUserNewMessages(res.newMessages));

        navigate("/chat");

        return;
      }
    } catch (error) {
      console.log("An error occurred during signup:", error);

      return;
    }
  };

  useEffect(() => {
    console.log("formErrors:", formErrors);
    if (isSubmit && Object.keys(formErrors).length === 0) {
      signUpHandler();
    }
  }, [formErrors]);

  return (
    <>
      <Container>
        <Row>
          <Col
            md={7}
            className="d-flex align-items-center justify-content-center flex-direction-column"
          >
            <form
              style={{ width: "80%", maxWidth: 500 }}
              onSubmit={handleSubmit}
            >
              <h1 className="text-center">Create Account</h1>
              <div className={Styles.profileContainer}>
                <img
                  src={imagePreview || SampleProfileImage}
                  className={Styles.profilePic}
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <i
                    className={`${Styles.addPictureIcon} fas fa-plus-circle`}
                  ></i>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={changeImageHandler}
                />
                {imgError && <p className="alert alert-danger">{imgError}</p>}
              </div>
              <label>Name</label>
              <br />
              <input
                type="text"
                placeholder="Name"
                value={signupInfo.name}
                name="name"
                onChange={handleChange}
                maxLength={40}
                required
              />
              {formErrors.name && (
                <p>
                  <small>{formErrors.name}</small>
                </p>
              )}
              <br /> <br />
              <label>Email</label>
              <br />
              <input
                type="email"
                placeholder="Email"
                value={signupInfo.email}
                name="email"
                onChange={handleChange}
                maxLength={40}
                required
              />
              {formErrors.email && (
                <p>
                  <small>{formErrors.email}</small>
                </p>
              )}
              <br /> <br />
              <label>Password</label>
              <br />
              <input
                type="password"
                placeholder="Password"
                value={signupInfo.password}
                name="password"
                onChange={handleChange}
                maxLength={30}
                required
              />
              {formErrors.password && (
                <p>
                  <small>{formErrors.password}</small>
                </p>
              )}
              <br /> <br />
              <label>Confirm Password</label>
              <br />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupInfo.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                maxLength={30}
                required
              />
              {formErrors.confirmPassword && (
                <p>
                  <small>{formErrors.confirmPassword}</small>
                </p>
              )}
              <br /> <br />
              <label>Mobile Number</label>
              <br />
              <input
                type="text"
                placeholder="Mobile Number"
                value={signupInfo.mobileNumber}
                name="mobileNumber"
                onChange={handleChange}
                maxLength={10}
                required
              />
              {formErrors.mobileNumber && (
                <p>
                  <small>{formErrors.mobileNumber}</small>
                </p>
              )}
              <br /> <br />
              <Button variant="primary" type="submit">
                {uploadingImage ? "Signing you up..." : "Signup"}
              </Button>
              <div className="py-4">
                <p className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
          </Col>
          <Col md={5} className={Styles.signup__bg}></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
