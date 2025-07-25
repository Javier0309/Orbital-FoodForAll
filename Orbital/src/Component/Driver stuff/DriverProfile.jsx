import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DriverHeader from './DriverHeader';
import Upload from '../../assets/upload_area.jpg';
import './DriverProfile.css';

const DriverProfile = () => {
  const driverId = localStorage.getItem("driverId");
  const [driver, setDriver] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [about, setAbout] = useState('');

  useEffect(() => {
    const fetchDriver = async () => {
      const res = await axios.get(`http://localhost:4000/api/drivers/${driverId}`);
      setDriver(res.data.driver);
      setAbout(res.data.driver.about || '');
    };
    fetchDriver();
  }, [driverId]);

  const handleUpload = async () => {
    if (!newImage) return;
    const formData = new FormData();
    formData.append("profilePic", newImage);
    const res = await axios.post(`http://localhost:4000/api/drivers/${driverId}/upload-profile-pic`, formData);
    if (res.data.success) {
      setDriver(prev => ({ ...prev, profilePicUrl: res.data.profilePicUrl }));
      setNewImage(null);
    }
  };

  const handleAboutChange = async (e) => {
    const newAbout = e.target.value;
    setAbout(newAbout);

    setTimeout(async () => {
      try {
        await axios.put(`http://localhost:4000/api/drivers/${driverId}/about`, {
          about: newAbout
        });
      } catch (error) {
        console.error('Failed to save about:', error);
      }
    }, 1000);
  };

  if (!driver) return <p>Loading driver profile...</p>;

  return (
    <div>
      <DriverHeader />
      <div className='driver-pfp-container'>
        <div className='driver-box'>
          <div className="profile-image-centered">
            <label htmlFor='profileImage' className='pfp-label'>
              <img
                className='pfp'
                src={newImage
                  ? URL.createObjectURL(newImage)
                  : (driver.profilePicUrl ? `http://localhost:4000${driver.profilePicUrl}` : Upload)}
                alt="Profile"
              />
              <input
                onChange={(e) => setNewImage(e.target.files[0])}
                type='file'
                id='profileImage'
                hidden
                accept="image/*"
              />
              {newImage && (
                <button className='upload-btn' type="button" onClick={handleUpload}>
                  Upload
                </button>
              )}
            </label>
          </div>
          <div className="profile-info-centered">
            <p className='profile-title'>Volunteer Delivery Rider</p>
            <h2 className='driver-name'>{driver.name}</h2>
            <p className='vehicle-info'>{driver.vehicleType}, {driver.licensePlate}</p>
            <p className='deliveries'>Meals Delivered: {driver.totalDeliveries}</p>
          </div>
          <div className='about-section wider'>
            <textarea
              id='about'
              value={about}
              onChange={handleAboutChange}
              className='about-textarea'
              placeholder="Tell us why you volunteered!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;