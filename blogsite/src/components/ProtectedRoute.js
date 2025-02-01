import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToggleContext } from '../context/myContext';

const ProtectedRoute = () => {
    const {url} = useContext(ToggleContext);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch(`${url}/authenticate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    setIsAuthenticated(true); // Allow the user to proceed
                    console.log("response if okay ")
                } else {
                    console.log("redirectling to /login from protected route")
                    navigate("/login"); // Redirect to login if not authenticated
                }
            } catch (error) {
                console.error("Error authenticating user:", error);
                navigate("/login");
            }
        };

        authenticateUser();
    }, []);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }
    return <Outlet />;
};

export default ProtectedRoute;
