import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";

import { useDispatch, useSelector } from "react-redux";
import { loginCall } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  // Change the useEffect to use Redux state instead of localStorage
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!userInfo.username || !userInfo.password) {
        alert("Please fill in all fields");
        return;
      }
      await dispatch(loginCall(userInfo)).unwrap();
    } catch (error) {
      console.error("Error during login request:", error);
      alert(error.message || "An error occurred during login");
    }
  };

  return (
    <div>
      <form id="loginform">
        <input type="text" placeholder="Enter your username" name="username" onChange={handleChange} value={userInfo.username} />
        <input type="password" placeholder="Enter your password" name="password" onChange={handleChange} value={userInfo.password} />
        <button type="submit" onClick={handleSubmit}> Login </button>
        <div id="create-account-login" onClick={() => navigate("/register")}>
          Create Account?
        </div>
      </form>
    </div>
  );
};

export default Login;
