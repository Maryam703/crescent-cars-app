import React, { useState } from 'react'
import "./LoginSignUp.css";
import { Form, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adress, setAdress] = useState("");
    const [city, setCity] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signUpHandler = async (e) => {
        setLoading(true);
        e.preventDefault();

        const formData = {
            name,
            email,
            password,
            adress,
            city,
            contact,

        };

        try {
            let res = await axios.post("/user/sign-up", formData);

            let { user } = res.data

            if (user) {
                localStorage.setItem("user", JSON.stringify(user))
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    return (
        <>
            {loading && <Loader /> }
            <Form className='signup-login-container' onSubmit={signUpHandler}>
                <div>  <div className='signup-login-profle-image'></div>
                    <p className='signup-login-name-logo'>Welcome to the CRESCENT MINE!</p>
                   <input type='text' value={name} required placeholder='Enter your full name:' onChange={(e) => setName(e.target.value)} />
                    <input type='email' value={email} required placeholder='Enter your email:' onChange={(e) => setEmail(e.target.value)} />
                    <input type='text' value={adress} required placeholder='Enter your complete adress:' onChange={(e) => setAdress(e.target.value)} />
                    <input type='text' value={city} required placeholder='Enter your city name:' onChange={(e) => setCity(e.target.value)} />
                    <input type='number' value={contact} required placeholder='Enter your mobile number:' onChange={(e) => setContact(e.target.value)} />
                    <input type='password' value={password} required placeholder='Enter your password:' onChange={(e) => setPassword(e.target.value)} />

                    <button>Sign Up</button>

                    <p className='signup-login-redirect-para'>Already have an account? <Link to="/">Login here!</Link></p>
                </div>
            </Form>
        </>
    )
}

export default SignUp
