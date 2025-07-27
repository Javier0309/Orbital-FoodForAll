import React, { useState, useEffect, useContext, useRef } from 'react';
import BusHeader from './BusHeader';
import './ViewProfile.css';
import phoneIcon from '../../assets/phone.png';
import locationIcon from '../../assets/location.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StoreContext } from '../Customer stuff/StoreContext.jsx';
import halalIcon from '../../assets/halal symbol.png';

function ViewProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
  const businessId = localStorage.getItem('businessId');

  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [bubbleType, setBubbleType] = useState(null); 
  const actionButtonsRef = useRef(null);

  useEffect(() => {
    if (!bubbleType) return;
    function handleClickOutside(e) {
      if (actionButtonsRef.current && !actionButtonsRef.current.contains(e.target)) {
        setBubbleType(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bubbleType]);

  useEffect(() => {
    if (businessId) {
      fetch(`${API_BASE_URL}/business/profile/${businessId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRestaurant(data.business);
          } else {
            setError('Failed to load business information.');
          }
        })
        .catch(() => setError('Failed to load business information.'))
        

      fetch(`${API_BASE_URL}/business/${businessId}/reviews`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReviews(data.reviews || []);
          }
        })
        .catch(() => {});

      fetch(`${API_BASE_URL}/business/completed-orders/${businessId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCompletedOrders(data.completedCount || 0);
          }
        })
        .catch(() => {});
    } else {
      setError('Business ID not found. Please log in again.');
    }
  }, [API_BASE_URL, businessId]);

  const { food_list } = useContext(StoreContext);
  const availableMenuItems = food_list.filter(item => item.businessId?._id === businessId && item.quantity > 0);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const businessReviewSliderSettings = {
    accessibility: true, dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true, responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ]};

  const businessAvailableItemsSliderSettings = {
    accessibility: true, dots: false, infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1,arrows: true, variableWidth: true,responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
    ]
  };

  if (error) {
    return (
      <div>
        <BusHeader />
        <div className="business-profile-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div>
        <BusHeader />
        <div className="business-profile-error">
          <p>Business not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BusHeader />
      <div className="business-profile-container">
        <div className="business-hero">
          <div
            className="business-background"
            style={{
              backgroundImage: restaurant.backgroundImageUrl
                ? `url(${BACKEND_BASE_URL}${restaurant.backgroundImageUrl})`
                : 'grey'
            }}
          >
            <div className="business-overlay"></div>
            <div className="business-hero-content">
              <div className="business-hero-main-content">
                <h1 className="business-hero-name">
                  {restaurant.name}
                  {restaurant.halalCertUrl && (
                    <img src={halalIcon} alt="Halal" style={{height: 32, marginLeft: 12, verticalAlign: 'middle'}} />
                  )}
                </h1>
                {/* About Section */}
                <div className="business-about-section">
                  <div className="business-about-card">
                    <h3>About {restaurant.name}</h3>
                    <p>{restaurant.about || restaurant.description || "No description available"}</p>
                  </div>
                </div>
                {/* Certificate Buttons Section */}
                <div className="business-certificate-buttons-section">
                  <div className="business-certificate-buttons">
                    <a
                      href={restaurant.businessLicenseUrl ? `${BACKEND_BASE_URL}${restaurant.businessLicenseUrl}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`business-cert-button${!restaurant.businessLicenseUrl ? ' business-cert-disabled' : ''}`}
                    >
                      Business License
                    </a>
                    <a
                      href={restaurant.hygieneCertUrl ? `${BACKEND_BASE_URL}${restaurant.hygieneCertUrl}` : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`business-cert-button${!restaurant.hygieneCertUrl ? ' business-cert-disabled' : ''}`}
                    >
                      Hygiene Certificate
                    </a>
                  </div>
                </div>
              </div>
              <div className="business-hero-action-buttons" ref={actionButtonsRef}>
                <button
                  className="business-hero-action-btn"
                  onClick={() => setBubbleType(bubbleType === 'phone' ? null : 'phone')}
                  title={`Show phone number for ${restaurant.name}`}
                  type="button"
                  style={{position: 'relative'}}
                >
                  <img src={phoneIcon} alt="Phone" />
                  {bubbleType === 'phone' && restaurant.phone && (
                    <div className="business-phone-bubble">
                      <div className="business-address-bubble-content">
                        <div className="business-address-title">Phone</div>
                        <div className="business-address-text">{restaurant.phone}</div>
                      </div>
                    </div>
                  )}
                </button>
                <button
                  className="business-hero-action-btn"
                  onClick={() => setBubbleType(bubbleType === 'address' ? null : 'address')}
                  title={`Show address for ${restaurant.name}`}
                  type="button"
                  style={{position: 'relative'}}
                >
                  <img src={locationIcon} alt="Location" />
                  {bubbleType === 'address' && (restaurant.location || restaurant.address) && (
                    <div className="business-address-bubble">
                      <div className="business-address-bubble-content">
                        <div className="business-address-title">Address</div>
                        <div className="business-address-text">{restaurant.location || restaurant.address || "Address not available"}</div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section*/}
        <div className="business-reviews-section">
          <div className="business-meals-delivered-info">
            <p>Meals Donated: <span className="business-meals-count">{completedOrders}</span></p>
          </div>
          {reviews.length > 0 ? (
            <>
              <div className="business-reviews-header">
                <h4>Reviews ({reviews.length})</h4>
                <div className="business-average-rating">
                  <span className="business-stars">{"★".repeat(Math.floor(averageRating))}{"☆".repeat(5 - Math.floor(averageRating))}</span>
                  <span className="business-rating-text">{averageRating} / 5.0</span>
                </div>
              </div>
              <div className="business-reviews-slider-container">
                <Slider {...businessReviewSliderSettings}>
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="business-review-card"
                    >
                      <div className="business-review-customer-name">
                        {review.customerName || 'Anonymous'}
                      </div>
                      <div className="business-review-stars">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                      <div className="business-review-text">
                        {review.review}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </>
          ) : (
            <div className="business-no-reviews-message">
              <p>No reviews yet. Be the first to review this business!</p>
              <button className="business-review-restaurant-btn" tabIndex={-1} aria-disabled="true" style={{pointerEvents: 'none'}}>Review Restaurant</button>
            </div>
          )}
        </div>

        <div className="business-details">
          <div className="business-available-items-section">
            <h3>Available Items</h3>
            {availableMenuItems.length > 0 ? (
              <div className="business-available-items-slider-container">
                <Slider {...businessAvailableItemsSliderSettings}>
                  {availableMenuItems.map(item => (
                    <div key={item._id}>
                      <div className="business-foodcard">
                        <div className="business-content">
                          <img className="business-card-image" src={item.image ? `${BACKEND_BASE_URL}/uploads/${item.image}` : ""} alt="" />
                          <h2 className="business-card-title">{item.name}</h2>
                          <p className="business-card-text">{item.desc && item.desc.length > 100 ? item.desc.slice(0,60) + '...' : item.desc}</p>
                        </div>
                      </div>
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