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
  const [hoverRating, setHoverRating] = useState(0);
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

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = (starCount, isInteractive = false) => {
    const stars = [];
    const displayRating = isInteractive ? hoverRating || rating : starCount;
    
    for (let i = 1; i <= 5; i++) {
      const starStyle = {
        fontSize: '32px',
        cursor: isInteractive ? 'pointer' : 'default',
        color: i <= displayRating ? '#f5b301' : '#ddd',
        marginRight: '6px',
        transition: 'color 0.2s ease'
      };

      if (isInteractive) {
        stars.push(
          <span
            key={i}
            style={starStyle}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleStarHover(i)}
            onMouseLeave={handleStarLeave}
          >
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} style={starStyle}>
            ★
          </span>
        );
      }
    }
    return stars;
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
            Your Name: <input 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)} 
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "16px",
                marginTop: "8px",
                boxSizing: "border-box",
                transition: "border-color 0.3s ease"
              }}
            />
          </label>
          <br />
          <br />
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Your Review: {renderStars(rating, true)}
          </label>
          <textarea 
            value={reviewText} 
            onChange={e => setReviewText(e.target.value)} 
            rows={4} 
            style={{
              width: "100%", 
              marginTop: "8px",
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
              transition: "border-color 0.3s ease"
            }}
          />
          <button type="submit" style={{
            background: "rgb(244, 163, 149)",
            fontSize: "20px",
            color: "rgb(0, 0, 0)",
            border: "1px solid whitesmoke",
            padding: "14px 20px",
            borderRadius: "50px",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.3s",
            marginTop: "20px"
          }}>Submit Review</button>
        </form>
        {message && <div style={{marginTop: "12px", color: "#d62828"}}>{message}</div>}
        <hr style={{marginTop: "40px"}} />
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
                <div style={{marginTop: "6px"}}>
                  {renderStars(review.rating)}
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