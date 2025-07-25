import React, { useContext, useState } from "react";
import { supabase } from '../../backend/SupabaseClient.js';
import axios from "axios";
import { RecoveryContext } from "../App.jsx";

const OTPInput = () => {
  const { email } = useContext(RecoveryContext);
  const [otp, setOTP] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    setStatus("Verifying...");
    try {
      const response = await axios.post("http://localhost:4000/api/recovery/verify_otp", {
        recipient_email: email,
        otp
      });
      if (response.data.success) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "http://localhost:5174/reset"
        });
        if (error) {
          setStatus("Failed to send reset email: " + error.message);
        } else {
          setStatus("✅ Success! Check your email for the password reset link.");
        }
      } else {
        setStatus("❌ Invalid or expired OTP.");
      }
    } catch (err) {
      setStatus("Server error. Try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f9fa"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem 2.5rem",
        borderRadius: "14px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
        minWidth: "340px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "1.1rem", fontWeight: 600, fontSize: "1.08rem" }}>
          Email for reset:<br /><span style={{ color: "#219ebc" }}>{email}</span>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "1.2rem", justifyContent: "center" }}>
          <input
            type="text"
            value={otp}
            onChange={e => setOTP(e.target.value)}
            placeholder="Enter OTP"
            style={{
              padding: "10px 14px",
              fontSize: "1rem",
              border: "1px solid #c1c1c1",
              borderRadius: "8px",
              outline: "none",
              flex: 1
            }}
          />
          <button
            onClick={handleVerify}
            style={{
              padding: "10px 18px",
              background: "#219ebc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Verify & Send Reset Link
          </button>
        </div>
        {status && (
          <div style={{
            marginTop: ".7rem",
            fontSize: ".99rem",
            color: status.startsWith("✅") ? "#2e9d51" : "#e63946",
            minHeight: "1.2em"
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPInput;