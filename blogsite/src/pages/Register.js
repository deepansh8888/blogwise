import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

import { useSelector } from 'react-redux';

const Register = ()=> {
    const navigate = useNavigate();
    const [regData, setRegData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const { isAuthenticated } = useSelector((state)=> state.auth);
      // Extracts the 'isAuthenticated' property from the 'auth' slice in the Redux store state
    //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

        useEffect(()=>{
            if(isAuthenticated){
                navigate('/home');
                console.log("Navigating to home from register");
            }
            else {
                navigate('/register');
                console.log("Navigating to register from register");
            }
    }, []);

    const handleChange = (event)=> {
        const {name, value} = event.target;
        setRegData({...regData, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                method: "POST",
                body: JSON.stringify(regData),
                headers: { 'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            alert('Registration successful!');
            navigate("/login");

        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || 'Failed to register. Please try again.');
            if(error.message === "This user already exists"){
                navigate("/login");
            }
        }
    }

  return (
  <div >
    <form onSubmit={handleSubmit} id="loginform">
        <input name='username' value={regData.username} onChange={handleChange} placeholder='Enter Username'/>
        <input name='email' value={regData.email} onChange={handleChange} placeholder='Enter Email'/>
        <input name='password' value={regData.password} onChange={handleChange} placeholder='Enter Password' type='password'/>
        <button type='submit'>Register</button>
        <div id="create-account-login" onClick={()=>navigate("/login")}> Already have an account? Login here</div>
    </form>
    </div>
    )
}

export default Register;