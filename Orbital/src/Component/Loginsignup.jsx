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
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [dietaryNeeds, setDietaryNeeds] = useState('');
    const [proofFile, setProofFile] = useState(null);
    const [vehicleType, setVehicleType] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [pfp, setPfp] = useState(null);
    const [files, setFiles] = useState({
        businessLicense: null,
        hygieneCert: null,
        halalCert: null
    });
    const [form, setForm] = useState({
        name: '',
        about: '',
        address: '',
      });

  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

    const FileUploadBox = ({ label, fileType, required = false, note = null, customFileSetter = null }) => {
    const selectedFile = customFileSetter === setPfp ? pfp 
                        : customFileSetter === setProofFile ? proofFile 
                        : customFileSetter ? null : files[fileType]

    return (
    <div className="file-upload-section">
      <label className="file-upload-label">
        {label} {required && <span className="required">*</span>}
        {note && <span className="note">{note}</span>}
      </label>
      <div 
        className={`file-upload-box ${selectedFile ? 'has-file' : ''}`}
        onClick={() => document.getElementById(fileType).click()}
      >
        <input
          id={fileType}
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => {
            const file = e.target.files[0]
            if (customFileSetter) {
                customFileSetter(file);
            } else {
                handleFileChange(fileType, file)}
            }}
            style={{ display: 'none' }}
        />
        {selectedFile ? (
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-name">{selectedFile.name}</div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">Click to upload</div>
          </div>
        )}
      </div>
    </div>
  );}

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
                localStorage.setItem('email', user.email);
                localStorage.setItem('userType', storedUserType);


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
                    const res = await axios.get(`http://localhost:4000/api/signup/customer-by-email/${localStorage.getItem('email')}`)
                    if (res.data.success && res.data.customer?._id){
                        localStorage.setItem('customerId', res.data.customer._id)
                    }

                    if (res.data.success && res.data.customer?.isVerified) {
                        navigate('/custmain');
                    } else {
                    navigate('/awaiting-verification');
                    }
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
                    const businessId = localStorage.getItem('businessId');
                    if (!businessId) return;
                    const res = await axios.get(`http://localhost:4000/api/signup/business-by-email/${localStorage.getItem('email')}`)

                    if (res.data.success && res.data.business?.isVerified) {
                        navigate("/busmain")
                    } else {
                    navigate('/awaiting-verification');
                    }
                } else {
                    const res = await axios.get(`http://localhost:4000/api/signup/driver-by-email/${localStorage.getItem('email')}`)
                    if (res.data.success && res.data.driver?._id){
                        localStorage.setItem('driverId', res.data.driver._id)
                    }
                    navigate('/drivermain')
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
                return
            }
            try {
                const userRes = await axios.post("http://localhost:4000/api/user/create", {
                    email: localEmail,
                    name,
                    userType,
                    address,
                });

                if (!userRes.data.success || !userRes.data.userId){
                    alert("Failed to create user in database");
                    setLoading(false);
                    return;
                }

                const userId = userRes.data.userId;
                localStorage.setItem("mongoUserId", userId)

                
                if (userType === 'F&B business') {
                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('email', localEmail);
                    formData.append('address', address);
                    formData.append('userId', userId);
                    
                    // Add files if they exist
                    if (files.businessLicense) formData.append('businessLicense', files.businessLicense);
                    if (files.hygieneCert) formData.append('hygieneCert', files.hygieneCert);
                    if (files.halalCert) formData.append('halalCert', files.halalCert);

                    const res = await axios.post("http://localhost:4000/api/signup/create-business",
                        formData, { headers: {"Content-Type" : "multipart/form-data"} }
                    );

                    if (res.data.success && res.data.businessId) {
                        localStorage.setItem('businessId', res.data.businessId);
                        localStorage.setItem('email', localEmail)
                        localStorage.setItem('userType', userType)
                        alert('Signup successful');
                        navigate('/awaiting-verification')
                    } else {
                        localStorage.removeItem("businessId")
                        alert('Failed to create business profile')
                        setLoading(false)
                        return
                    }

                } else if (userType === 'customer') {
                    const custForm = new FormData();
                    custForm.append('name', name);
                    custForm.append('email', localEmail);
                    custForm.append('address', address);
                    custForm.append('phone', phone);
                    custForm.append('dietaryNeeds', dietaryNeeds);
                    custForm.append('userId', userId);
                    custForm.append('userType', 'customer');
                    
                    // Add files if they exist
                    if (proofFile) custForm.append('proofOfNeed', proofFile);
                    const res = await axios.post("http://localhost:4000/api/signup/create-customer",
                        custForm, { headers: {"Content-Type" : "multipart/form-data"} }
                    );

                    if (res.data.success && res.data.customerId) {
                        localStorage.setItem('email', localEmail)
                        localStorage.setItem('userType', userType)
                        localStorage.setItem('customerId', res.data.customerId)
                        alert('Signup successful');
                        navigate('/awaiting-verification')
                    } else {
                        localStorage.removeItem("customerId")
                        alert('Failed to create business profile')
                        setLoading(false)
                        return
                    } 
                } else if (userType === 'driver') {
                    const driverForm = new FormData();
                    driverForm.append('name', name);
                    driverForm.append('email', localEmail);
                    driverForm.append('phone', phone);
                    driverForm.append('vehicleType', vehicleType);
                    driverForm.append('licensePlate', licensePlate);
                    driverForm.append('userId', userId);
                    driverForm.append('userType', 'driver');
                    
                    // Add files if they exist
                    if (pfp) driverForm.append('profilePicture', pfp); 
                    const res = await axios.post("http://localhost:4000/api/signup/create-driver",
                        driverForm, { headers: {"Content-Type" : "multipart/form-data"} }
                    ); 

                    if (res.data.success && res.data.driverId) {
                        localStorage.setItem('email', localEmail)
                        localStorage.setItem('userType', userType)
                        localStorage.setItem('driverId', res.data.driverId)
                        alert('Signup successful');
                        navigate('/drivermain')
                        //navigate('/awaiting-verification')
                    } else {
                        localStorage.removeItem("driverId")
                        alert('Failed to create driver profile')
                        setLoading(false)
                        return
                    } 
                
                } else {
                    alert('Signup unsuccessful')
                    return
                }
                setLoading(false);
            } catch (error) {
                console.error('Error during user creation', error);
                alert('Signup failed. Please try again')
            }

            setLoading(false)
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
                            <option value="driver">Rider</option>
                        </select>
                    </div>
                )}

                {!isLogin && userType === 'driver' && (
                    <>
                    <div className='input'>
                            <input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className='input'>
                            <input type='text' placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    </div>

                    <div className='input'>
                            <input type='text' placeholder='Vehicle Description' value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}/>
                    </div>

                    <div className='input'>
                            <input type='text' placeholder='License Plate Number' value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)}/>
                    </div>

                    <FileUploadBox label="Profile Picture (Your face must be in the picture) " fileType="profilePicture" customFileSetter={setPfp} required/>

                    </>
                 )}

                {!isLogin && userType === 'customer' && (
                    <>
                        <div className='input'>
                            <input type='text' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>

                        <div className='input'>
                            <input type='text' placeholder='Home Address' value={address} onChange={(e) => setAddress(e.target.value)}/>
                        </div>

                        <div className='input'>
                            <input type='text' placeholder='Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </div>

                        <div className='input'>
                            <input type='text' placeholder='Dietary Requirements / Allergies' value={dietaryNeeds} onChange={(e) => setDietaryNeeds(e.target.value)}/>
                        </div>

                        <FileUploadBox label="Proof of Need (such as income statements, number of people in household, or any government assistance programs)" fileType="proofOfNeed" customFileSetter={setProofFile}/>

                    </>
                )}

                {!isLogin && userType === 'F&B business' && (
                    <>
                        <div className='input'>
                            <input type='text' placeholder='Business Name' value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>

                        <div className='input'>
                            <input type='text' placeholder='Address of Shop' value={address} onChange={(e) => setAddress(e.target.value)}/>
                        </div>

                        <FileUploadBox label="BUSINESS LICENSE" fileType="businessLicense"/>
                        <FileUploadBox label="RELEVANT HYGIENE CERTIFICATES" fileType="hygieneCert"/>
                        <FileUploadBox label="HALAL CERTIFICATION" fileType="halalCert" note="if applicable"/>
                        
                    </>
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

