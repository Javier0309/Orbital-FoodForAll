import './BusMain.css'
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';

function BusHeader() {
    const navigate = useNavigate();
    const location = useLocation();
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
        setToggle(newStatus)
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

    return(
        <div className='bus-header'>
            <img src={logo} alt="" className="logo"></img>
            <ul className='bus-header-menu'>
                <li onClick={()=>navigate("/busmain")} className={location.pathname === '/busmain' ? 'active' : ''}>Home</li>
                <li onClick={()=>navigate('/busmenu')} className={location.pathname === '/busmenu' ? 'active' : ''}>Edit Menu</li>
                <li onClick={()=>navigate('/edit-profile')} className={location.pathname === '/edit-profile' ? 'active' : ''}>Edit Profile</li>
                <li onClick={()=>navigate('/view-profile')} className={location.pathname === '/view-profile' ? 'active' : ''}>View Profile</li>
                <li onClick={()=>navigate('/business-order-history')} className={location.pathname === '/business-order-history' ? 'active' : ''}>Order History</li>
                <li onClick={()=>navigate('/reviews')} className={location.pathname === '/reviews' ? 'active' : ''}>Reviews</li>
                <li onClick={()=>navigate('/about')} className={location.pathname === '/about' ? 'active' : ''}>About</li>
            </ul>

            <div className='bus-header-right'>
                <img src={searchicon} alt=""></img>
                <button onClick={handleToggle} className={`toggle-btn ${toggle ? 'toggle' : ''}`}>
                    <div className="thumb"></div>
                </button>
            </div>
        </div>
    );
}

export default BusHeader;