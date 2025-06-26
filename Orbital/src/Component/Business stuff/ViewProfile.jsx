import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BusHeader from './BusHeader';
import './EditProfile.css';

function ViewProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
  const location = useLocation();

  // Use businessId from navigation state, fallback to localStorage for business users
  const businessId = location.state?.businessId || localStorage.getItem("businessId");
  const updatedAt = location.state?.updatedAt;

  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

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
  }, [API_BASE_URL, businessId, updatedAt]);

  if (message) {
    return (
      <div className="edit-profile-bg">
        <BusHeader />
        <div className="view-profile-container">
          <div className="profile-error-card">
            <div className="edit-profile-message">{message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="edit-profile-bg">
        <BusHeader />
        <div className="view-profile-container">
          <div className="profile-loading-card">
            <div className="loading-spinner"></div>
            <div>Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-bg">
      <BusHeader />
      <div className="view-profile-container">
        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{profile.name}</h1>
            <div className="profile-established">
              <span className="established-label">Established</span>
              <span className="established-year">{profile.yearEstablished}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-content-grid">
          {/* About Section */}
          <div className="profile-card profile-about-card">
            <h3 className="profile-card-title">About</h3>
            <div className="profile-about-text">
              {profile.about || "No description provided"}
            </div>
          </div>

          {/* Location Section */}
          <div className="profile-card profile-location-card">
            <h3 className="profile-card-title">
              <span className="location-icon">📍</span>
              Location
            </h3>
            <div className="profile-location-text">
              {profile.address || "Address not provided"}
            </div>
          </div>

          {/* Recommended Items Section 
          <div className="profile-card profile-items-card">
            <h3 className="profile-card-title">
              <span className="star-icon">⭐</span>
              Recommended Items
            </h3>
            <div className="recommended-items-list">
              {(profile.recommendedItems && profile.recommendedItems.length > 0) ? (
                profile.recommendedItems.map((item, idx) => (
                  <div key={idx} className="recommended-item">
                    <span className="item-bullet">•</span>
                    <span className="item-text">{item}</span>
                  </div>
                ))
              ) : (
                <div className="no-items">No recommended items listed</div>
              )}
            </div>
          </div> */}

          {/* Certificate Section */}
          <div className="profile-card profile-cert-card">
            <h3 className="profile-card-title">
              Food Hygiene Certificate
            </h3>
            <div className="certificate-status">
              {profile.hygieneCertUrl ? (
                <a
                  href={`${BACKEND_BASE_URL}${profile.hygieneCertUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-link"
                >
                  <span className="cert-icon-small">📄</span>
                  View Certificate
                </a>
              ) : (
                <div className="cert-not-uploaded">
                  <span className="cert-icon-small">❌</span>
                  Not uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;