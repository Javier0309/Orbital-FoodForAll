import './DriverMain.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'

function DriverHeader() {

    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();

    return(
        <div className='driver-header'>
            <img src={logo} alt="" className="logo" onClick={()=>{setMenu("home"), navigate('/drivermain')}}></img>
            <ul className='driver-header-menu'>
                {/* className='active': underlined when clicked
                    className='': not underlined because not clicked
                    setMenu will decide whether it is underlined or not
                eg. when i click on about, about will be underlined*/}
                <li onClick={()=>{setMenu("home"), navigate('/drivermain')}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>{setMenu("view-profile"), navigate('/driverprofile')}} className={menu==="view-profile"?"active":""}>View Profile</li>
                <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='driver-header-right'>
                
                <div className="search-icon">
                </div>
                <button>Log out</button>
            </div>
        </div>
    );
}

export default DriverHeader;