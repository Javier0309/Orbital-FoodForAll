import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import BusHeader from './BusHeader';
import './EditProfile.css';
import phoneIcon from '../../assets/phone.png';
import locationIcon from '../../assets/location.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FoodCard from "../Customer stuff/FoodCard.jsx";
import { StoreContext } from "../Customer stuff/StoreContext.jsx";

function ViewProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  // Remove trailing '/api' to get the backend's base URL for static files
  const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
  const location = useLocation();

  // Use businessId from navigation state, fallback to localStorage for business users
  const businessId = location.state?.businessId || localStorage.getItem("businessId");
  const updatedAt = location.state?.updatedAt;

  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [showAddressBubble, setShowAddressBubble] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);

  const reviewSliderSettings = {accessibility: true, dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true, responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ]};

  const availableItemsSliderSettings = {accessibility: true, dots: false, infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1, arrows: true, variableWidth: true, responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
    ]};

  const handleLocationClick = () => {
    setShowAddressBubble((prev) => !prev);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    if (!businessId) {
      setMessage('Business ID not found. Please log in again.');
      return;
    }

    fetch(`${API_BASE_URL}/business/profile/${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.business);
        } else {
          setMessage('Failed to load profile.');
        }
      })
      .catch(() => setMessage('Failed to load profile.'));

    // Fetch reviews for this restaurant
    if (businessId) {
      fetch(`${API_BASE_URL}/business/${businessId}/reviews`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReviews(data.reviews || []);
          }
        })
        .catch(err => console.error('Failed to load reviews:', err));
    }

    // Fetch completed orders count for this restaurant
    if (businessId) {
      fetch(`${API_BASE_URL}/business/completed-orders/${businessId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCompletedOrders(data.completedCount || 0);
          }
        })
        .catch(err => console.error('Failed to load completed orders count:', err));
    }
  }, [API_BASE_URL, businessId, updatedAt]);

  if (message) {
    return (
      <div>
        <BusHeader />
        <div className="restaurant-loading">
          <div className="loading-spinner"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <BusHeader />
        <div className="restaurant-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const { food_list } = useContext(StoreContext);
  const availableMenuItems = food_list.filter(item => item.businessId?._id === businessId && item.quantity > 0);

  return (
    <div>
      <BusHeader />
      <div className="customer-restaurant-container">
        <div className="restaurant-hero">
          <div 
            className="restaurant-background"
            style={{
              backgroundImage: profile.backgroundImageUrl 
                ? `url(${BACKEND_BASE_URL}${profile.backgroundImageUrl})`
                : 'grey'
            }}
          >
            <div className="restaurant-overlay"></div>
            <div className="restaurant-hero-content">
              <div className="restaurant-hero-main-content">
                <h1 className="restaurant-hero-name">{profile.name}</h1>
                
                {/* Restaurant About Section */}
                <div className="restaurant-about-section">
                  <div className="restaurant-about-card">
                    <h3>About {profile.name}</h3>
                    <p>{profile.about || profile.description || "No description available"}</p>
                  </div>
                </div>

                {/* Certificate Buttons Section */}
                <div className="certificate-buttons-section">
                  <div className="certificate-buttons">
                    <a
                      href={profile.businessLicenseUrl ? `${BACKEND_BASE_URL}${profile.businessLicenseUrl}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cert-button ${!profile.businessLicenseUrl ? 'disabled' : ''}`}
                      onClick={e => !profile.businessLicenseUrl && e.preventDefault()}
                    >
                      Business License
                    </a>
                    <a
                      href={profile.hygieneCertUrl ? `${BACKEND_BASE_URL}${profile.hygieneCertUrl}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cert-button ${!profile.hygieneCertUrl ? 'disabled' : ''}`}
                      onClick={e => !profile.hygieneCertUrl && e.preventDefault()}
                    >
                      Hygiene Certificate
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="restaurant-hero-action-buttons">
                {profile.phone ? (
                  <a className="hero-action-btn" href={`tel:${profile.phone}`} title={`Call ${profile.name}`}>
                    <img src={phoneIcon} alt="Phone" />
                  </a>
                ) : (
                  <button className="hero-action-btn" disabled title="Phone number not available">
                    <img src={phoneIcon} alt="Phone" />
                  </button>
                )}
                <button className="hero-action-btn" onClick={handleLocationClick}><img src={locationIcon} alt="Location" /></button>
                
                {showAddressBubble && (
                  <div className="address-bubble">
                    <div className="address-bubble-content">
                      <div className="address-title">Address</div>
                      <div className="address-text">{profile.location || profile.address || "Address not available"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="meals-delivered-info">
            <p>Meals Delivered: <span className="meals-count">{completedOrders}</span></p>
          </div>
          {reviews.length > 0 ? (
            <>
              <div className="reviews-header">
                <h4>Reviews ({reviews.length})</h4>
                <div className="average-rating">
                  <span className="stars">{"★".repeat(Math.floor(averageRating))}{"☆".repeat(5 - Math.floor(averageRating))}</span>
                  <span className="rating-text">{averageRating} / 5.0</span>
                </div>
              </div>
              <div className="reviews-slider-container">
                <Slider {...reviewSliderSettings}>
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="review-card"
                    >
                      <div className="review-customer-name">
                        {review.customerName || 'Anonymous'}
                      </div>
                      <div className="review-stars">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                      <div className="review-text">
                        {review.review}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          ) : (
            <div className="no-reviews-message">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>

        <div className="restaurant-details">
          <div className="restaurant-location-section">
            <div className="restaurant-location-card">
              <h3>Location</h3>
              <p>{profile.location || profile.address || "Address not provided"}</p>
            </div>
          </div>

          <div className="restaurant-halal-section">
            <div className="restaurant-halal-card">
              <h3>Halal Certificate</h3>
              <div className="halal-cert-status">
                {profile.halalCertUrl ? (
                  <a
                    href={`${BACKEND_BASE_URL}${profile.halalCertUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="halal-cert-link"
                  >
                    <span className="cert-icon-small">☪️</span>
                    View Certificate
                  </a>
                ) : (
                  <div className="halal-cert-not-available">
                    <span className="cert-icon-small">❌</span>
                    Not uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="available-items-section">
            <h3>Available Items</h3>
            {availableMenuItems.length > 0 ? (
              <div className="available-items-slider-container">
                <Slider {...availableItemsSliderSettings}>
                  {availableMenuItems.map(item => (
                    <div key={item._id}>
                      <FoodCard
                        id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} cookedAt={item.cookedAt} consumeBy={item.consumeBy} comment={item.comment} image={item.image} businessId={item.businessId}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <p>No items available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;