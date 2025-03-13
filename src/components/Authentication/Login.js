import React, { useState } from 'react'
import "./LoginSignUp.css"
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import axios from 'axios';

export default function Login() {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false)
 const navigate = useNavigate();

  let userData = {
    email,
    password
  }

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      let response = await axios.post("/user/login-user", userData)
      let { user } = response.data;
   
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        navigate("/dashboard")
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <>
       {loading && <Loader /> }
    <div className='signup-login-container'>
      <div>
        <div className='signup-login-profle-image'></div>
        <p className='signup-login-name-logo'>Welcome to the CRESCENT MINE!</p>

        <input required type='email' value={email} placeholder='Enter your email:' onChange={(e) => setEmail(e.target.value)} />
        <input required type='password' value={password} placeholder='Enter your password:' onChange={(e) => setPassword(e.target.value)} />

        <button onClick={loginHandler}>Sign In</button>

        <p className='signup-login-redirect-para'>Don't have an account? <Link to="/sign-up">SignUp here!</Link></p>
      </div>
    </div>
    </>
  )
}

