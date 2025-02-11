import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';
import { ToggleContext } from '../context/myContext';

import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';


const Login = ()=> {
    const navigate = useNavigate();
    const {url} = useContext(ToggleContext);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [userinfo , setUserInfo] = useState({
        username: '',
        password: '',
    })
    
    // Change the useEffect to use Redux state instead of localStorage
        useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
        }, [isAuthenticated, navigate]);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUserInfo({
            ...userinfo,
            [name]: value
        })
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        try {
            if (!userinfo.username || !userinfo.password) {
                alert("Please fill in all fields");
                return;
            }
            const response = await fetch(`${url}/login`, {
                method: "POST",
                body: JSON.stringify(userinfo),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(response.ok){
                console.log("Login attempt", data);
                
                dispatch(loginSuccess({
                    username: userinfo.username,
                    token: data.token
                }));
                navigate("/home");
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch(error) {
            console.error("Error during login request:", error);
            alert(error.message || "An error occurred during login");
        }
    };

    return <div >
        <form id="loginform">
        <input type='text' placeholder='Enter your username' name='username' onChange={handleChange} value={userinfo.username} /> 
        <input type='password' placeholder='Enter your password' name='password' onChange={handleChange} value={userinfo.password} />
        <button type='submit'onClick={handleSubmit} >Login</button>
        <div id="create-account-login" onClick={()=>navigate("/register")}>Create Account?</div>
        </form>
        
    </div>
}

export default Login;