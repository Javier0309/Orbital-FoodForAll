//ReadableStreamDefaultController
import './Loginsignup.css'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../SupabaseClient.js';

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'
import foodImage from '../assets/foood.jpeg'

const Loginsignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleAuth = async () => {
        if (!email || !password){
            alert('Please enter email and password');
            return;
        }

        setLoading(true);

        if (isLogin) {
            const {error} = await supabase.auth.signInWithPassword({email,password})
            if (error) alert('Login error: ' + error.message)
            else {
            // Fetch the user type from user metadata
            const { data: { user } } = await supabase.auth.getUser();
            const storedUserType = user?.user_metadata?.userType;

            alert('Logged in!')
            if (storedUserType === 'customer') {
                navigate('/custmain');
            } else {
                navigate('/busmain');
            }
          
            }
        }
        else {
            if (!userType) {
                alert('Please select a user type');
                setLoading(false);
                return;
            }

            const {error} = await supabase.auth.signUp({
                email,password,options: {data: {userType, name}}})
            if (error) alert('Signup error: ' + error.message);
            else {
                alert('Signup successful!');
            if (userType === 'customer') {
                navigate('/custmain');
            } else {
                navigate('/busmain');
            }
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
        
        <div className='container'>
            <div className="left">
                <img src={foodImage} alt="Food"/>
            </div>
            <div className="right">
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

                {!isLogin && (
                    <div className="input">
                        <label htmlFor="userType"></label>
                        <select
                        id="userType"
                        value={userType}
                        onChange={handleUserTypeChange}
                        className="dropdown"
                        >
                            <option value="">Select User Type</option>
                            <option value="customer">Customer</option>
                            <option value="F&B business">F&B Business</option>
                            <option value="rider">Rider</option>
                        </select>
                    </div>
                )}

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
        </div>
    )
}

export default Loginsignup