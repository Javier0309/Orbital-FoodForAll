import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CustHeader from './CustHeader';

function ReviewRestaurant() {
  const { businessId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/business/${businessId}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.reviews || []);
      });
  }, [API_BASE_URL, businessId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      setMessage('Please provide a rating and review.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/business/${businessId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review: reviewText, customerName })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Review submitted!');
        setReviews(data.reviews);
        setRating(0);
        setReviewText('');
        setCustomerName('');
      } else {
        setMessage('Failed to submit review.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
  };

  return (
    <div>
      <CustHeader />
      <div style={{
        maxWidth: "600px",
        margin: "40px auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
      }}>
        <h2>Review {restaurant?.name || 'Restaurant'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Your Name: <input value={customerName} onChange={e => setCustomerName(e.target.value)} />
          </label>
          <br />
          <label>
            Rating:
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              <option value={0}>Select rating</option>
              {[1,2,3,4,5].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Your Review:
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} style={{width: "100%", marginTop: "8px"}} />
          </label>
          <button type="submit" style={{marginTop: "16px"}}>Submit Review</button>
        </form>
        {message && <div style={{marginTop: "12px", color: "#d62828"}}>{message}</div>}
        <hr />
        <h3>Other Customers' Reviews</h3>
        {reviews.length === 0 ? <p>No reviews yet.</p> : (
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

export default ReviewRestaurant;