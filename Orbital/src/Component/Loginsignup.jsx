import './Loginsignup.css'
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../../backend/SupabaseClient.js';
import { RecoveryContext } from "../App.jsx";
import axios from 'axios';

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'
import foodImage from '../assets/foood.jpeg'

import { handleLogin, handleSignup } from '../utils/auth'; // Import helpers

const Loginsignup = () => {
    const [localEmail, setLocalEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { setOTP, setEmail } = useContext(RecoveryContext);

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleAuth = async () => {
        if (!localEmail || !password){
            alert('Please enter email and password');
            return;
        }

        setLoading(true);

        if (isLogin) {
            // Use the helper function
            const { error, data } = await handleLogin(localEmail, password);
            if (error) {
                alert('Login error: ' + error.message);
                setLoading(false);
            } else {
                // Fetch the user type from user metadata
                const { user } = data;
                const storedUserType = user?.user_metadata?.userType;

                // ===== ADDED: Fetch MongoDB user by email and store _id =====
                try {
                    const res = await axios.get(`http://localhost:4000/api/user/by-email/${user.email}`);
                    if (res.data.success && res.data.user) {
                        localStorage.setItem("mongoUserId", res.data.user._id);
                    }
                } catch (err) {
                    console.error("Error fetching MongoDB user:", err);
                }
                // ===== END ADDED =====

                alert('Logged in!');
                if (storedUserType === 'customer') {
                    navigate('/custmain');
                } else if (storedUserType === 'F&B business') {
                    try {
                        const bizRes = await axios.get(`http://localhost:4000/api/signup/business-by-email/${user.email}`);
                        if (bizRes.data.success && bizRes.data.business && bizRes.data.business._id) {
                            localStorage.setItem("businessId", bizRes.data.business._id);
                        } else {
                            // Handle missing business profile
                            localStorage.removeItem("businessId");
                            alert("Business profile not found. Please sign up as a business.");
                            setLoading(false);
                            return;
                        }
                    } catch (err) {
                        console.error("Error fetching business doc:", err);
                        localStorage.removeItem("businessId");
                        alert("Business profile not found. Please sign up as a business.");
                        setLoading(false);
                        return;
                    }
                    navigate('/busmain');
                } else {
                    navigate('/busmain');
                }
                setLoading(false);
            }
        }
        else {
            if (!userType) {
                alert('Please select a user type');
                setLoading(false);
                return;
            }

            // Use your signup helper
            const { error, data } = await handleSignup(localEmail, password, { userType, name });
            if (error) {
                alert('Signup error: ' + error.message);
                setLoading(false);
            } else {
                try {
                    const userRes = await axios.post("http://localhost:4000/api/user/create", {
                        email: localEmail,
                        name,
                        userType
                    });
                    if (userRes.data.success && userRes.data.userId) {
                        localStorage.setItem("mongoUserId", userRes.data.userId);
                    }
                } catch (e) {
                    console.error("Error creating MongoDB user:", e);
                }
                alert('Signup successful!');
                if (userType === 'F&B business') {
                    const res = await axios.post("http://localhost:4000/api/signup/create-business", {
                        name, 
                        email: localEmail
                    });

                    if (res.data.success && res.data.businessId) {
                        localStorage.setItem('businessId', res.data.businessId);
                    } else {
                        localStorage.removeItem("businessId");
                        alert("Failed to create business profile. Please try again or contact support.");
                        setLoading(false);
                        return;
                    }
                    navigate('/busmain');
                } else {
                    navigate('/custmain');
                }
                setLoading(false);
            }
        }
    };

    const navigateToOTP = async () => {
        if (!localEmail) {
            alert('Please enter your email');
            return;
        }
        try {
            setEmail(localEmail);
            await axios.post("http://localhost:4000/api/recovery/send_recovery_email", {
                recipient_email: localEmail,
            });
            navigate('otp');  // Navigate to OTP input page after OTP is sent
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Error sending OTP. Please try again.");
        }
    };

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
                    <input type="email" placeholder="Email" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)}/>
                </div>

                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </div>
            
            <div className="Forgot-password" onClick={navigateToOTP}>Forgotten your password? <span>Click here</span></div>
            <div className="submit-container">
                <button className="submit" onClick={handleAuth} disabled={loading}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
                <button className="submit" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Log In'}
                </button>
            </div>
        </div>
        </div>
    )
}

export default Loginsignup