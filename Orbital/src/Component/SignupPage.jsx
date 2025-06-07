import React, { useState } from 'react';
import './SignupPage.css'

const SignupPage = () => {
    const [userType, setUserType] = useState("");
    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    return (
      <div className="signup-container">
        <h2>Welcome to the Sign Up Page!</h2>
        <div className="form-container">
          <div className="input-field">
            <label htmlFor="userType"></label>
            <select
            id="UserType"
            value={userType}
            onChange={handleUserTypeChange}
            className="dropdown"
            > 
            <option value="">Select User Type</option>
            <option value="customer">Customer</option>
            <option value="F&B business">F&B business</option>
            <option value="rider">rider</option>
            </select>
            </div>
            <div className="input-field">
            <label htmlFor="name"></label>
            <input type="text" id="name" placeholder="Enter your full name / business" />
          </div>
          <div className="input-field">
            <label htmlFor="email"></label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="input-field">
            <label htmlFor="password"></label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <div className="buttons">
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignupPage;