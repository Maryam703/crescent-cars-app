import React, { useState } from 'react'
import "./LoginSignUp.css";
import { Form, Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { supabase } from '../supabaseClient';

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signUpHandler = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error('Sign-up error:', error.message);
                return;
            }

            setLoading(false)

            if (data.user) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

    return (
        <>
            {loading && <Loader />}
            <Form className='signup-login-container' onSubmit={signUpHandler}>
                <div>  <div className='signup-login-profle-image'></div>
                    <p className='signup-login-name-logo'>Welcome to the CRESCENT MINE!</p>
                    <input type='email' value={email} required placeholder='Enter your email:' onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' value={password} required placeholder='Enter your password:' onChange={(e) => setPassword(e.target.value)} />

                    <button>Sign Up</button>

                    <p className='signup-login-redirect-para'>Already have an account? <Link to="/">Login here!</Link></p>
                </div>
            </Form>
        </>
    )
}

export default SignUp
