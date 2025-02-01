import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

const Login = ()=> {
    const navigate = useNavigate();
    const [userinfo , setUserInfo] = useState({
        username: '',
        password: '',
    })

    useEffect(()=>{
        let token = localStorage.getItem('token');
        if ( token && token !== 'undefined') {
            navigate("/home");
            console.log("Navigating to home from login");
          } else {
            console.log("Navigating to login from login ");
            navigate("/login");
          }
    }, []);

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
            const response = await fetch("https://blogwise-backend.onrender.com/login", {
                method: "POST",
                body: JSON.stringify(userinfo),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(response.ok){
                console.log("Login Successful", data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', userinfo.username);
                console.log("Token fetched from local storage:",localStorage.getItem('token'));
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