import './BusMain.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import { toast } from 'react-toastify';
import axios from 'axios';

function BusHeader() {

    const [menu, setMenu] = useState("Home");
    const navigate = useNavigate();

    // for open or closed
    const [toggle, setToggle] = useState(false);
    const businessId = localStorage.getItem("businessId")

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/business/status/${businessId}`)
                if (res.data.success) {
                    setToggle(res.data.isOpen);
                }
            } catch (error) {
                console.error("Error fetching open status")
            }
        }

        fetchStatus()
    }, [businessId])

    const handleToggle = async () => {
        const newStatus = !toggle;
        setToggle(newStatus)    //immediate ui update

        try {
            await axios.post('http://localhost:4000/api/business/openOrClosed', {
                businessId,
                isOpen: newStatus
            })
            toast.success(`You are now ${newStatus ? "open" : "closed"}`)
        } catch (error) {
            toast.error(`Failed to update status, you are still ${newStatus ? "open" : "closed"}`);
            console.error(error);
        }
    }

    const handleLogout = () => {
        // Optionally remove businessId, token, etc.
        localStorage.removeItem("businessId");
        toast.info("Logged out successfully");
        navigate("/");
    };

    return(
        <div className='bus-header'>
            <img src={logo} alt="" className="logo"></img>
            <ul className='bus-header-menu'>
                <li onClick={()=>{navigate("/busmain"); setMenu("home")}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("edit-menu")} className={menu==="edit-menu"?"active":""}>Edit Menu</li>
                <li onClick={()=>{navigate("/edit-profile");setMenu("edit-profile")}} className={menu==="edit-profile"?"active":""}>Edit Profile</li>
                <li onClick={()=>{navigate("/view-profile");setMenu("view-profile")}} className={menu==="view-profile"?"active":""}>View Profile</li>
                <li onClick={()=>{navigate("/order-history"); setMenu("order-history")}} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>{navigate("/reviews");setMenu("reviews")}} className={menu==="reviews"?"active":""}>Reviews</li>
                <li onClick={()=>{navigate("/about");setMenu("about")}} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='bus-header-right'>
                <img src={searchicon} alt=""></img>
                <button onClick={handleToggle} className={`toggle-btn ${toggle ? 'toggle' : ''}`}>
                    <div className="thumb"></div>
                </button>
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
            </div>
        </div>
    );
}

export default BusHeader;