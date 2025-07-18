import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CustHeader from './CustHeader';
import './CustomerRestaurantView.css'; 

function CustomerRestaurantView() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
  
  const { businessId } = useParams(); // Get businessId from URL
  const location = useLocation();
  
  // Try to get restaurant data from navigation state first, then fetch if not available
  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [loading, setLoading] = useState(!restaurant);
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState([]);

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

    // Fetch menu items for this restaurant
    if (businessId) {
      fetch(`${API_BASE_URL}/food/list/${businessId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMenuItems(data.foods || []);
          }
        })
        .catch(err => console.error('Failed to load menu items:', err));
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

  return (
    <div>
      <CustHeader />
      <div className="customer-restaurant-container">
        {/* Restaurant Header */}
        <div className="restaurant-header">
          <div className="restaurant-avatar">
            {restaurant.name ? restaurant.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="restaurant-info">
            <h1 className="restaurant-name">{restaurant.name}</h1>
            <div className="restaurant-established">
              <span>Established {restaurant.yearEstablished || "N/A"}</span>
            </div>
            <div className="restaurant-location">
              <span className="location-icon">📍</span>
              {restaurant.location || restaurant.address || "Address not available"}
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="restaurant-details">
          <div className="restaurant-about">
            <h3>About {restaurant.name}</h3>
            <p>{restaurant.about || restaurant.description || "No description available"}</p>
          </div>

          {/* Certificates Section */}
          <div className="restaurant-certificates">
            <h3>Certifications</h3>
            <div className="certificates-grid">
              <div className="cert-item">
                <span className="cert-label">Food Hygiene Certificate:</span>
                {restaurant.hygieneCertUrl ? (
                  <a
                    href={`${BACKEND_BASE_URL}${restaurant.hygieneCertUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-link"
                  >
                    ✅ View Certificate
                  </a>
                ) : (
                  <span className="cert-not-available">❌ Not available</span>
                )}
              </div>
              
              <div className="cert-item">
                <span className="cert-label">Business License:</span>
                {restaurant.businessLicenseUrl ? (
                  <a
                    href={`${BACKEND_BASE_URL}${restaurant.businessLicenseUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-link"
                  >
                    ✅ View License
                  </a>
                ) : (
                  <span className="cert-not-available">❌ Not available</span>
                )}
              </div>
              
              <div className="cert-item">
                <span className="cert-label">Halal Certificate:</span>
                {restaurant.halalCertUrl ? (
                  <a
                    href={`${BACKEND_BASE_URL}${restaurant.halalCertUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-link"
                  >
                    ✅ View Certificate
                  </a>
                ) : (
                  <span className="cert-not-available">❌ Not available</span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="restaurant-menu">
            <h3>Available Items</h3>
            {menuItems.length > 0 ? (
              <div className="menu-grid">
                {menuItems.map(item => (
                  <div key={item._id} className="menu-item-card">
                    <img 
                      src={`${BACKEND_BASE_URL}/uploads/${item.image}`} 
                      alt={item.name}
                      className="menu-item-image"
                    />
                    <div className="menu-item-info">
                      <h4>{item.name}</h4>
                      <p className="menu-item-desc">{item.desc}</p>
                      <div className="menu-item-details">
                        <span>Available: {item.quantity}</span>
                        <span>Consume by: {new Date(item.consumeBy).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
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

export default CustomerRestaurantView;