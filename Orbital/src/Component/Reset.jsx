import React, { useState } from "react";
import { supabase } from '../../backend/SupabaseClient.js';

export default function Reset() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function changePassword(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!password || !confirm) {
      setErrorMsg("Please enter and confirm your password.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message || "Failed to reset password.");
    } else {
      setSuccess(true);
    }
  }

  if (success) {
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
          <h2 style={{ color: "#2e9d51", marginBottom: "1rem" }}>Password reset successful!</h2>
          <p style={{ fontSize: "1.07rem", color: "#333" }}>
            You may now log in with your new password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f9fa"
    }}>
      <form
        onSubmit={changePassword}
        style={{
          background: "#fff",
          padding: "2.5rem 2.5rem",
          borderRadius: "14px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
          minWidth: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          alignItems: "center"
        }}
      >
        <h2 style={{ marginBottom: "0.8rem", color: "#219ebc" }}>Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: "10px 14px",
            fontSize: "1rem",
            border: "1px solid #c1c1c1",
            borderRadius: "8px",
            outline: "none",
            width: "100%"
          }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{
            padding: "10px 14px",
            fontSize: "1rem",
            border: "1px solid #c1c1c1",
            borderRadius: "8px",
            outline: "none",
            width: "100%"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 18px",
            background: "#219ebc",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            marginTop: "0.8rem",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
        {errorMsg && (
          <div style={{
            color: "#e63946",
            marginTop: "0.5rem",
            fontSize: "1.01rem",
            minHeight: "1.2em"
          }}>
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
}