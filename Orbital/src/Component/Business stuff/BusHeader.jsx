import './BusMain.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import basketicon from '../../assets/basketicon.png'

function BusHeader() {

    const [menu, setMenu] = useState("Home");
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);

    return(
        <div className='bus-header'>
            <img src={logo} alt="" className="logo"></img>
            <ul className='bus-header-menu'>
                {/* className='active': underlined when clicked
                    className='': not underlined because not clicked
                    setMenu will decide whether it is underlined or not
                eg. when i click on about, about will be underlined*/}
                <li onClick={()=>{navigate("/busmain");setMenu("home")}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("edit-menu")} className={menu==="edit-menu"?"active":""}>Edit Menu</li>
                <li onClick={()=>{navigate("/edit-profile"); setMenu("edit-profile")}} className={menu==="edit-profile"?"active":""}>Edit Profile</li>  
                <li onClick={()=>{navigate("/view-profile"); setMenu("view-profile")}} className={menu==="view-profile"?"active":""}>View Profile</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>setMenu("reviews")} className={menu==="reviews"?"active":""}>Reviews</li>
                <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='bus-header-right'>
                <img src={searchicon} alt=""></img>
                <button className={`toggle-btn ${toggle ? 'toggle' : ''}`} onClick={() => setToggle(!toggle)}>
                    <div className="thumb"></div>
                </button>
            </div>
        </div>
    );
}

export default BusHeader;