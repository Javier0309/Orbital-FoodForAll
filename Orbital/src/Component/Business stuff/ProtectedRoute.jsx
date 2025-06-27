import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(null);
  const navigate = useNavigate();
  const mongoUserId = localStorage.getItem("mongoUserId");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (!mongoUserId) {
      navigate("/login");
      return;
    }
    fetch(`${API_BASE_URL}/business/profile/${mongoUserId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.isProfileComplete) {
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && profileComplete === false) {
      navigate("/edit-profile", { state: { error: "Please complete your profile before proceeding." } });
    }
  }, [loading, profileComplete, navigate]);

  if (loading || profileComplete === false) {
    return <div>Loading...</div>;
  }
  return children;
}
export default ProtectedRoute;