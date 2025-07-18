import React, { useState, useEffect } from 'react';
import BusHeader from "./BusHeader";

function BusAbout() {
  return (
    <div>
      <BusHeader />
      <div className="about-container" style={{
        maxWidth: "700px",
        margin: "40px auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#d62828" }}>
          About Us
        </h1>
        <p style={{ fontSize: "1.15rem", lineHeight: "1.7", color: "#222" }}>
          At <strong>FoodForAll</strong>, we are dedicated to fighting hunger and reducing food waste by connecting food and beverage (F&amp;B) businesses with underprivileged families in need. 
          Our platform provides a simple, efficient way for restaurants, cafes, and other F&amp;B establishments to donate their surplus food, ensuring that delicious meals reach those who need them most.<br /><br />
          By fostering a community of generosity and sustainability, we aim to create a future where no good food goes to waste, and every family has access to nourishing meals. 
          <br /><br />
          <strong>Join us in making a meaningful impact—one meal at a time.</strong>
        </p>
      </div>
    </div>
  );
}

export default BusAbout;