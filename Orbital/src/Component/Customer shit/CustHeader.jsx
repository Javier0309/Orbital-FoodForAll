import './CustMain.css'
import React, { useState } from 'react'
import logo from '../../assets/foodforall logo.png'
import searchicon from '../../assets/searchicon.png'
import basketicon from '../../assets/basketicon.png'

function CustHeader() {

    const [menu, setMenu] = useState("Home");
    return(
        <div className='cust-header'>
            <img src={logo} alt="" className="logo"></img>
            <ul className='cust-header-menu'>
                {/* className='active': underlined when clicked
                    className='': not underlined because not clicked
                    setMenu will decide whether it is underlined or not
                eg. when i click on about, about will be underlined*/}
                <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</li>
                <li onClick={()=>setMenu("order-history")} className={menu==="order-history"?"active":""}>Order History</li>
                <li onClick={()=>setMenu("favourites")} className={menu==="favourites"?"active":""}>Favourites</li>
                <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li>
            </ul>

            <div className='cust-header-right'>
                <img src={searchicon} alt=""></img>
                <div className="search-icon">
                    <img src={basketicon} alt="" />
                    <div className="dot"></div>
                </div>
                <button>Sign in</button>
            </div>
        </div>
    );
}

export default CustHeader;