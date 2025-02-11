import React, { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToggleContext } from "../context/myContext";

import { useSelector, useDispatch } from "react-redux";
import { restoreAuth } from "../features/auth/authSlice";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { url } = useContext(ToggleContext);
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${url}/authenticate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          // setIsAuthenticated(true); // Allow the user to proceed
          dispatch(restoreAuth());
          console.log("response if okay ");
        } else {
          console.log("redirectling to /login from protected route");
          navigate("/login"); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        navigate("/login");
      }
    };

    authenticateUser();
  }, [token, navigate, dispatch, url]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
