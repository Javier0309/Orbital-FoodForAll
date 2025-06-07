import React, { useState } from 'react';

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // Handle form submission to upload the file
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('image', selectedImage);

    // Make the API call to upload the image
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Image uploaded successfully!');
        } else {
          alert('Image upload failed!');
        }
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
      });
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Verification Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="image">Choose Image</label>
          <input 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
        <div className="buttons">
          <button type="submit" className="upload-btn">
            Upload Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
