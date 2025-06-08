//ReadableStreamDefaultController
import './Loginsignup.css'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../SupabaseClient.js';

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

const Loginsignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        if (!email || !password){
            alert('Please enter email and password');
            return;
        }

        if (isLogin) {
            const {error} = await supabase.auth.signInWithPassword({email,password})
            if (error) alert('Login error: ' + error.message)
            else {
            alert('Logged in!')
            navigate('/custmain');
            setLoading(false); 
            }
        }
        else {
            const {error} = await supabase.auth.signUp({email,password})
            if (error) alert('Signup error: ' + error.message);
            else {
                alert('Signup successful!');
                navigate('/custmain');
                setLoading(false);
            }
        }
    }

    /*
    const handleLogOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) alert('Logout error: ' + error.message)
        else alert('Logged out')
    } */

    return (
        <div className='container' >
            <div className="header">
                <div className="text">Food For All</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {!isLogin && (
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div> )}

                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </div>
            
            <div className="Forgot-password">Forgotten your password? <span>Click here</span></div>
            <div className="submit-container">
                <button className="submit" onClick={handleAuth}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
                <button className="submit" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Log In'}
                </button>
                {/*
                <Link to = "/signup" className="submit">Sign Up</Link>
                <Link to = "/custmain" className="submit">Log in</Link>
                */}
            </div>
        </div>
    )
}

export default Loginsignup