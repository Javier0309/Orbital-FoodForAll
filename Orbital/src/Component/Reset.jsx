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
      <div>
        <h2>Password reset successful!</h2>
        <p>You may now log in with your new password.</p>
      </div>
    );
  }

  return (
    <form onSubmit={changePassword}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset password"}
      </button>
      {errorMsg && <div>{errorMsg}</div>}
    </form>
  );
}