import React, { useState, useEffect } from 'react';
import BusHeader from './BusHeader';
import './EditProfile.css';

function EditProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
  const mongoUserId = localStorage.getItem("mongoUserId"); // <--- Always use this!

  const [form, setForm] = useState({
    name: '',
    yearEstablished: '',
    about: '',
    address: '',
    recommendedItems: [''],
  });
  const [certFile, setCertFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!mongoUserId) {
      setMessage('User ID not found. Please log in again.');
      return;
    }
    fetch(`${API_BASE_URL}/business/profile/${mongoUserId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForm({
            name: data.business.name || '',
            yearEstablished: data.business.yearEstablished || '',
            about: data.business.about || '',
            address: data.business.address || '',
            recommendedItems: data.business.recommendedItems?.length > 0 ? data.business.recommendedItems : [''],
          });
        }
      })
      .catch(() => setMessage('Failed to load profile.'));
  }, [API_BASE_URL, mongoUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleItemsChange = (idx, value) => {
    const items = [...form.recommendedItems];
    items[idx] = value;
    setForm(f => ({ ...f, recommendedItems: items }));
  };

  const addItem = () => setForm(f => ({ ...f, recommendedItems: [...f.recommendedItems, ''] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mongoUserId) {
      setMessage('User ID not found. Please log in again.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('yearEstablished', form.yearEstablished);
    formData.append('about', form.about);
    formData.append('address', form.address);
    formData.append('recommendedItems', form.recommendedItems.join(','));
    if (certFile) formData.append('hygieneCert', certFile);

    try {
      const response = await fetch(`${API_BASE_URL}/business/profile/${mongoUserId}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Profile updated!');
      } else {
        setMessage('Update failed.');
      }
    } catch {
      setMessage('Update failed due to network error.');
    }
  };

  return (
    <div className="edit-profile-bg">
      <BusHeader />
      <div className="edit-profile-container">
        <h2>Edit Business Profile</h2>
        {message && <div className="edit-profile-message">{message}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row-flex">
            <div className="input-group">
              <label>Name:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group small">
              <label>Year Established:</label>
              <input
                name="yearEstablished"
                value={form.yearEstablished}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>
          <div>
            <label>About:</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={6}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label>Recommended Items:</label>
            <div className="recommended-items-group">
              {form.recommendedItems.map((item, idx) => (
                <input
                  key={idx}
                  value={item}
                  onChange={e => handleItemsChange(idx, e.target.value)}
                  placeholder={`Item #${idx + 1}`}
                />
              ))}
            </div>
            <button type="button" onClick={addItem}>Add Item</button>
          </div>
          <div>
            <label>Food Hygiene Certificate:</label>
            <div className="file-label-row">
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={e => setCertFile(e.target.files[0])}
              />
              {certFile && <span className="file-selected">{certFile.name}</span>}
            </div>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;