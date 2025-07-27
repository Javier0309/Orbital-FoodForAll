import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BusHeader from './BusHeader';
import './EditProfile.css';

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
        {/* Hero Section with Background Image */}
        <div className="profile-hero">
          <div 
            className="profile-background"
            style={{
              backgroundImage: profile.backgroundImageUrl 
                ? `url(${BACKEND_BASE_URL}${profile.backgroundImageUrl})`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="profile-overlay"></div>
            <div className="profile-hero-content">
              <h1 className="profile-hero-name">{profile.name}</h1>
              
              {/* About Section */}
              <div className="profile-about-section">
                <div className="profile-about-card">
                  <h3>About {profile.name}</h3>
                  <p>{profile.about || "No description provided"}</p>
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
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-content-grid">
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

          {/* Halal Certificate Section */}
          <div className="profile-card profile-cert-card">
            <h3 className="profile-card-title">
              Halal Certificate
            </h3>
            <div className="certificate-status">
              {profile.halalCertUrl ? (
                <a
                  href={`${BACKEND_BASE_URL}${profile.halalCertUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-link"
                >
                  <span className="cert-icon-small">☪️</span>
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