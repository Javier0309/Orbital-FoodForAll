import React from "react";
import CustHeader from "./CustHeader";
import logoFood from '../../assets/logofood.png'; // <-- fixed here

function CustAbout() {
  return (
    <div>
      <CustHeader />
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
          Welcome to <strong>FoodForAll</strong>! <br /><br />
          We believe everyone deserves access to healthy, delicious meals. Our mission is to make it easy for families and individuals to receive surplus food from local restaurants, cafes, and food providers who care about community and sustainability.<br /><br />
          By using FoodForAll, you’re helping reduce food waste and supporting a movement that brings people together. Whether you’re here to enjoy a great meal or help others, you’re making a positive impact.<br /><br />
          <strong>Thank you for being part of the FoodForAll community!</strong>
        </p>
        <img 
          src={logoFood} 
          alt="Food For All Logo" 
          style={{ display: 'block', margin: '40px auto 0 auto', maxWidth: '200px', opacity: 0.85 }}
        />
      </div>
    </div>
  );
}
export default CustAbout;