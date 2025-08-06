import DriverHeader from "./DriverHeader.jsx";
import logoFood from '../../assets/logofood.png';

function DriverAbout() {
  return (
    <div>
      <DriverHeader />
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
          Welcome to <strong>FoodForAll</strong> Riders!<br /><br />
          We work together to deliver surplus food from generous businesses directly to families in need. As a rider, you play a vital role in reducing food waste and making a positive impact in your community.<br /><br />
          Our platform makes it easy for you to connect with food donors and recipients, ensuring every delivery helps someone in need.<br /><br />
          <strong>Thank you for helping us make every meal count!</strong>
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
export default DriverAbout;