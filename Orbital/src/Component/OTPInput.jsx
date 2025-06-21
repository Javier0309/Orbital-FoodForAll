import React, { useContext, useState } from "react";
import { supabase } from '../../backend/SupabaseClient.js';
import axios from "axios";
import { RecoveryContext } from "../App.jsx";

const OTPInput = () => {
  const { email } = useContext(RecoveryContext);
  const [otp, setOTP] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    // 1. Verify OTP with backend
    const response = await axios.post("http://localhost:4000/api/recovery/verify_otp", {
      recipient_email: email,
      otp
    });
    if (response.data.success) {
      // 2. If success, trigger Supabase reset password email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5174/reset" // or your configured RESET_REDIRECT_URL
      });
      if (error) {
        setStatus("Failed to send reset email: " + error.message);
      } else {
        setStatus("Success! Check your email for the password reset link.");
      }
    } else {
      setStatus("Invalid or expired OTP.");
    }
  };

  return (
    <div>
      <div>Email for reset: {email}</div>
      <input
        type="text"
        value={otp}
        onChange={e => setOTP(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify & Send Reset Link</button>
      {status && <div>{status}</div>}
    </div>
  );
};

export default OTPInput;