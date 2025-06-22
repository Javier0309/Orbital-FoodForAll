import './BusMain.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import basketicon from '../../assets/basketicon.png'
import { toast } from 'react-toastify';
import axios from 'axios';

function BusHeader() {

    const [menu, setMenu] = useState("Home");
    const navigate = useNavigate();

    // for open or closed
    const [toggle, setToggle] = useState(false);
    const businessId = localStorage.getItem("businessId")

    useEffect(() => {
         console.log("➡️ Fetching business open status…", businessId);
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/business/status/${businessId}`)
                if (res.data.success) {
                    console.log("Setting toggle:", res.data.isOpen);
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

    return(
        <div className='bus-header'>
            <img src={logo} alt="" className="logo"></img>
            <ul className='bus-header-menu'>
                {/* className='active': underlined when clicked
                    className='': not underlined because not clicked
                    setMenu will decide whether it is underlined or not
                eg. when i click on about, about will be underlined*/}
                <li onClick={()=>{setMenu("home")}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("edit-menu")} className={menu==="edit-menu"?"active":""}>Edit Menu</li>
                <li onClick={()=>setMenu("edit-profile")} className={menu==="edit-profile"?"active":""}>Edit Profile</li>
                <li onClick={()=>setMenu("view-profile")} className={menu==="view-profile"?"active":""}>View Profile</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>setMenu("reviews")} className={menu==="reviews"?"active":""}>Reviews</li>
                <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li>
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