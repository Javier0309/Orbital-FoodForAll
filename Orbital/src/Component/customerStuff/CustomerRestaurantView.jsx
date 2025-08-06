import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CustHeader from './CustHeader';
import './CustomerRestaurantView.css'; 
import phoneIcon from '../../assets/phone.png';
import locationIcon from '../../assets/location.png';
import RestaurantPickupMap from './RestaurantPickupMap';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FoodCard from "./FoodCard.jsx";
import { StoreContext } from "./StoreContext.jsx";
import halalIcon from '../../assets/halal symbol.png';

function CustomerRestaurantView() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
  
  const { businessId } = useParams(); // Get businessId from URL
  const location = useLocation();
  
  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!restaurant);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [showAddressBubble, setShowAddressBubble] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
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
  const handleViewMap = () => {
    setShowMapModal(true);
    setShowAddressBubble(false);
  };
  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    // Always fetch restaurant data to ensure latest info is displayed
    if (businessId) {
      fetch(`${API_BASE_URL}/business/profile/${businessId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRestaurant(data.business);
          } else {
            setError('Failed to load restaurant information.');
          }
        })
        .catch(() => setError('Failed to load restaurant information.'))
        .finally(() => setLoading(false));
    }

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
  }, [API_BASE_URL, businessId]);

  // Debug: See what restaurant object looks like
  useEffect(() => {
    if (restaurant) {
      console.log('Restaurant state:', restaurant);
    }
  }, [restaurant]);

  if (loading) {
    return (
      <div>
        <CustHeader />
        <div className="restaurant-loading">
          <div className="loading-spinner"></div>
          <p>Loading restaurant information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <CustHeader />
        <div className="restaurant-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div>
        <CustHeader />
        <div className="restaurant-error">
          <p>Restaurant not found.</p>
        </div>
      </div>
    );
  }

  const { food_list } = useContext(StoreContext);
  const availableMenuItems = food_list.filter(item => item.businessId?._id === businessId && item.quantity > 0);

  return (
    <div>
      <CustHeader />
      <div className="customer-restaurant-container">
        <div className="restaurant-hero">
          <div 
            className="restaurant-background"
            style={{
              backgroundImage: restaurant.backgroundImageUrl 
                ? `url(${BACKEND_BASE_URL}${restaurant.backgroundImageUrl})`
                : 'grey'
            }}
          >
            <div className="restaurant-overlay"></div>
            <div className="restaurant-hero-content">
              <div className="restaurant-hero-main-content">
                <h1 className="restaurant-hero-name">
                  {restaurant.name}
                  {restaurant.halalCertUrl && (
                    <img src={halalIcon} alt="Halal" style={{height: 32, marginLeft: 12, verticalAlign: 'middle'}} />
                  )}
                </h1>
                
                {/* Restaurant About Section */}
                <div className="restaurant-about-section">
                  <div className="restaurant-about-card">
                    <h3>About {restaurant.name}</h3>
                    <p>{restaurant.about || restaurant.description || "No description available"}</p>
                  </div>
                </div>

                {/* Certificate Buttons Section */}
                <div className="certificate-buttons-section">
                  <div className="certificate-buttons">
                    <a
                      href={restaurant.businessLicenseUrl ? `${BACKEND_BASE_URL}${restaurant.businessLicenseUrl}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cert-button ${!restaurant.businessLicenseUrl ? 'disabled' : ''}`}
                      onClick={e => !restaurant.businessLicenseUrl && e.preventDefault()}
                    >
                      Business License
                    </a>
                    <a
                      href={restaurant.hygieneCertUrl ? `${BACKEND_BASE_URL}${restaurant.hygieneCertUrl}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cert-button ${!restaurant.hygieneCertUrl ? 'disabled' : ''}`}
                      onClick={e => !restaurant.hygieneCertUrl && e.preventDefault()}
                    >
                      Hygiene Certificate
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="restaurant-hero-action-buttons">
                {restaurant.phone ? (
                  <a className="hero-action-btn" href={`tel:${restaurant.phone}`} title={`Call ${restaurant.name}`}>
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
                      <div className="address-text">{restaurant.location || restaurant.address || "Address not available"}</div>
                      <button className="view-map-btn" onClick={handleViewMap}>View on Map</button>
                    </div>
                  </div>
                )}
                {/*
                <button className={`hero-action-btn heart-btn ${isHeartFilled ? 'heart-filled' : ''}`} onClick={toggleHeart}>
                  <img src={isHeartFilled ? heartFilledIcon : heartIcon} alt="Heart" />
                </button> */}
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
                <button className="review-restaurant-btn" onClick={() => {
                  if (!restaurant || !restaurant._id) {
                    alert('Restaurant information not available');
                    return;
                  }
                  window.location.href = `/restaurant/${restaurant._id}/review`;
                }}>Review Restaurant</button>
              </div>
            </div>
            <div className="reviews-slider-container">
              <Slider {...reviewSliderSettings}>
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="review-card"
                    onClick={() => {
                      if (!restaurant || !restaurant._id) {
                        alert('Restaurant information not available');
                        return;
                      }
                      window.location.href = `/restaurant/${restaurant._id}/review`;
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Read and write reviews"
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
            <p>No reviews yet. Be the first to review this restaurant!</p>
            <button className="review-restaurant-btn" onClick={() => {
              if (!restaurant || !restaurant._id) {
                alert('Restaurant information not available');
                return;
              }
              window.location.href = `/restaurant/${restaurant._id}/review`;
            }}>Review Restaurant</button>
          </div>
        )}
      </div>

          <div className="restaurant-details">

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
      {/* Map Modal */}
      {showMapModal && (
        <div className="map-modal-overlay" onClick={handleCloseMapModal}>
          <div className="map-modal" onClick={e => e.stopPropagation()}>
            <button className="close-map-modal" onClick={handleCloseMapModal}>×</button>
            <RestaurantPickupMap address={restaurant.location || restaurant.address} restaurantName={restaurant.name} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerRestaurantView;