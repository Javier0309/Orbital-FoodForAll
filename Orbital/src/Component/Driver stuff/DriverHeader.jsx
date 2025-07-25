import './DriverMain.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'

function DriverHeader() {

    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();

    return(
        <div className='driver-header' style={{padding: '10px 10px', minHeight: 0}}>
            <img src={logo} alt="" className="logo" style={{width: 250, cursor: 'pointer'}} onClick={()=>{setMenu("home"), navigate('/drivermain')}}></img>
            <ul className='driver-header-menu' style={{gap: 40, fontSize: 18}}>
                <li onClick={()=>{setMenu("home"), navigate('/drivermain')}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>{setMenu("view-profile"), navigate('/driverprofile')}} className={menu==="view-profile"?"active":""}>View Profile</li>
                <li onClick={()=>{setMenu("about"); navigate('/driver-about')}} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='driver-header-right' style={{gap: 40, alignItems: 'center'}}>
                <div className="search-icon">
                </div>
                <button style={{fontSize: 20, padding: '10px 30px', borderRadius: 50}}>Log out</button>
            </div>
        </div>
    );
}

export default DriverHeader;