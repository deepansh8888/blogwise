import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

const Register = ()=> {

    const navigate = useNavigate();
    const [regData, setRegData] = useState({
        username: '',
        email: '',
        password: ''
    });

        useEffect(()=>{
            let token = localStorage.getItem('token');
            if( token && token !== 'undefined'){
                navigate("/home");
                console.log("Navigating to home from register");
            }
            else{
                navigate("/register");
                console.log("Navigating to register from register");
            }
    }, []);

    const handleChange = (event)=> {
        console.log("handleChange Executed");
        const {name, value} = event.target;
        setRegData({...regData, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8080/register", {
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