import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BusHeader from './BusHeader';
import './EditProfile.css';

function EditProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const businessId = localStorage.getItem("businessId"); // <--- Always use this!
  const location = useLocation();
  const navigate = useNavigate();
  const errorFromState = location.state?.error;

  const [form, setForm] = useState({
    name: '',
    about: '',
    address: '',
    phone: '',
  });
  
  const [files, setFiles] = useState({
    businessLicense: null,
    hygieneCert: null,
    halalCert: null,
    backgroundImage: null
  });
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!businessId) {
      setMessage('Business ID not found. Please log in again.');
      return;
    }
    fetch(`${API_BASE_URL}/business/profile/${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForm({
            name: data.business.name || '',
            about: data.business.about || '',
            address: data.business.address || '',
            phone: data.business.phone || '',
          });
        }
      })
      .catch(() => setMessage('Failed to load profile.'));
  }, [API_BASE_URL, businessId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessId) {
      setMessage('Business ID not found. Please log in again.');
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('about', form.about);
    formData.append('address', form.address);
    formData.append('phone', form.phone);
    
    // Add files if they exist
    if (files.businessLicense) formData.append('businessLicense', files.businessLicense);
    if (files.hygieneCert) formData.append('hygieneCert', files.hygieneCert);
    if (files.halalCert) formData.append('halalCert', files.halalCert);
    if (files.backgroundImage) formData.append('backgroundImage', files.backgroundImage);

    try {
      const response = await fetch(`${API_BASE_URL}/business/profile/${businessId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
        navigate('/view-profile', {state: {businessId}})
      } else {
        setMessage('Update failed.');
      }
    } catch {
      setMessage('Update failed due to network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadBox = ({ label, fileType, required = false, note = null }) => (
    <div className="file-upload-section">
      <label className="file-upload-label">
        {label} {required && <span className="required">*</span>}
        {note && <span className="note">{note}</span>}
      </label>
      <div 
        className={`file-upload-box ${files[fileType] ? 'has-file' : ''}`}
        onClick={() => document.getElementById(fileType).click()}
      >
        <input
          id={fileType}
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileChange(fileType, e.target.files[0])}
          style={{ display: 'none' }}
        />
        {files[fileType] ? (
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-name">{files[fileType].name}</div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">Click to upload</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="edit-profile-bg">
      <BusHeader />
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h1>FOODFORALL</h1>
          <h2>Edit Business Profile</h2>
        </div>
        
        {(errorFromState || message) && (
          <div className="edit-profile-message error">
            {errorFromState || message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <label className="form-label">
              WHAT IS THE NAME OF YOUR RESTAURANT? <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Add your restaurant name"
              className="form-input"
              required
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              ADDRESS <span className="required">*</span>
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Add your restaurant address"
              className="form-textarea"
              rows="3"
              required
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              ABOUT YOUR RESTAURANT
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Tell us about your restaurant..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-section">
            <label className="form-label">
              PHONE NUMBER
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Add your restaurant phone number"
              className="form-input"
            />
          </div>

          <FileUploadBox 
            label="BUSINESS LICENSE" 
            fileType="businessLicense"
          />

          <FileUploadBox 
            label="RELEVANT HYGIENE CERTIFICATES" 
            fileType="hygieneCert"
          />

          <FileUploadBox 
            label="HALAL CERTIFICATION" 
            fileType="halalCert" 
            note="if applicable"
          />

          <FileUploadBox 
            label="BACKGROUND IMAGE" 
            fileType="backgroundImage"
            note="optional - will be displayed behind your restaurant name"
          />

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'UPDATING...' : 'UPDATE PROFILE'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;