import './CustMain.css'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import basketicon from '../../assets/basketicon.png'

function CustHeader() {

    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();

    return(
        <div className='cust-header'>
            <img src={logo} alt="" className="logo" onClick={()=>{setMenu("home"), navigate('/custmain')}}></img>
            <ul className='cust-header-menu'>
                {/* className='active': underlined when clicked
                    className='': not underlined because not clicked
                    setMenu will decide whether it is underlined or not
                eg. when i click on about, about will be underlined*/}
                <li onClick={()=>{setMenu("home"), navigate('/custmain')}} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>setMenu("favourites")} className={menu==="favourites"?"active":""}>Favourites</li>
                <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='cust-header-right'>
                
                <div className="search-icon">
                    <Link to={'/cart'}><img src={basketicon} alt="" /></Link>
                    <div className="dot"></div>
                </div>
                <button>Sign in</button>
            </div>
        </div>
    );
}

export default CustHeader;