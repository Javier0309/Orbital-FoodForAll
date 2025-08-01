import './DriverMain.css'
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'

function DriverHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    // Logout handler
    const handleLogout = () => {
        // Remove driver/session data as needed
        localStorage.removeItem("driverId");
        localStorage.removeItem("userType");
        localStorage.removeItem("mongoUserId");
        localStorage.removeItem("email");
        // Add other keys if necessary
        navigate("/");
    };

    return(
        <div className='driver-header' style={{padding: '10px 10px', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <img src={logo} alt="" className="logo" style={{width: 250, cursor: 'pointer'}} onClick={()=>navigate('/drivermain')}></img>
            <ul className='driver-header-menu' style={{gap: 40, fontSize: 18, marginLeft: 40}}>
                <li onClick={()=>navigate('/drivermain')} className={location.pathname === '/drivermain' ? 'active' : ''}>Home</li>
                <li onClick={()=>navigate('/driver-order-history')} className={location.pathname === '/driver-order-history' ? 'active' : ''}>Order History</li>
                <li onClick={()=>navigate('/driverprofile')} className={location.pathname === '/driverprofile' ? 'active' : ''}>View Profile</li>
                <li onClick={()=>navigate('/driver-about')} className={location.pathname === '/driver-about' ? 'active' : ''}>About</li>
            </ul>
            <div className='driver-header-right' style={{gap: 40, alignItems: 'center', display: 'flex'}}>
                {/* Add Logout Button */}
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    style={{
                        marginLeft: "20px",
                        padding: "8px 22px",
                        background: "linear-gradient(90deg,#ff7979 0%,#ffb199 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(255,121,121,0.08)",
                        transition: "background 0.2s"
                    }}
                >
                    Logout
                </button>
                <img src={logo} alt="" style={{width: 250, opacity: 0}} />
            </div>
        </div>
    );
}

export default DriverHeader;