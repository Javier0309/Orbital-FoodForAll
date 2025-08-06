import React, { useEffect, useState } from "react";
import BusHeader from "./BusHeader";

function BusReviews() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const businessId = localStorage.getItem("businessId");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) {
      setError("Business ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/business/${businessId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews || []);
        } else {
          setError("Failed to load reviews.");
        }
      })
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, [API_BASE_URL, businessId]);

  return (
    <div>
      <BusHeader />
      <div style={{
        maxWidth: "700px",
        margin: "40px auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
      }}>
        <h2>Customer Reviews</h2>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <div style={{ color: "#d62828" }}>{error}</div>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul style={{listStyle: "none", padding: 0}}>
            {reviews.map((review, i) => (
              <li key={i} style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #eee",
                paddingBottom: "1rem"
              }}>
                <div style={{fontWeight: "bold", fontSize: "1.1rem"}}>
                  {review.customerName}
                </div>
                <div style={{color: "#f5b301", fontWeight: "bold"}}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <div style={{marginTop: "6px"}}>
                  {review.review}
                </div>
                <div style={{fontSize: "0.9rem", color: "#888", marginTop: "6px"}}>
                  {review.createdAt ? new Date(review.createdAt).toLocaleString() : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BusReviews;