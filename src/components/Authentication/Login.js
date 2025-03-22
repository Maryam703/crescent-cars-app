import React, { useState } from 'react'
import "./LoginSignUp.css"
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Login with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(`Login failed: ${error.message}`);
        console.error('Login error:', error.message);
        setLoading(false);
        return;
      }

      console.log('User logged in:', data.user);

      // Redirect to dashboard if login is successful
      navigate('/dashboard');
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && <Loader />}
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

