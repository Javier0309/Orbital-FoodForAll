import './CustMain.css'
import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import basketicon from '../../assets/basketicon.png'
import { supabase } from '../../../backend/SupabaseClient';

function CustHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentOrder, setCurrentOrder] = useState(null)

    useEffect(() => {
        const fetchCurrentOrder = async () => {
            try {
                const session = await supabase.auth.getSession();
                const user = session.data.session?.user;

                if (user?.email){
                    const response = await fetch(`http://localhost:4000/api/order/customer-current/${user.email}`)
                    const data = await response.json()
                
                    if (data.success && data.order && !data.order.removedByCustomer && data.order.status !== 'rejected') {
                        setCurrentOrder(data.order)
                    } else {
                        setCurrentOrder(null)
                    }
                }
            } catch (error) {
                console.error('Error fetching current order:', error);
                setCurrentOrder(null)
            }
        }
        fetchCurrentOrder()
    }, [])

    const getActive = (path) => {
        if (path === '/custmain' && location.pathname === '/custmain') return 'active';
        if (path === '/customer-order-history' && location.pathname === '/customer-order-history') return 'active';
        if (path === '/customer-profile' && location.pathname === '/customer-profile') return 'active';
        if (path === '/customer-about' && location.pathname === '/customer-about') return 'active';
        return '';
    }

    // LOGOUT button logic
    const handleLogout = () => {
        // Remove customer/session data as needed
        localStorage.removeItem("customerId");
        localStorage.removeItem("userType");
        localStorage.removeItem("mongoUserId");
        localStorage.removeItem("email");
        // You might want to sign out from supabase as well:
        if (supabase && supabase.auth) supabase.auth.signOut();
        navigate("/");
    };

    return(
        <div className='cust-header'>
            <img src={logo} alt="" className="logo" onClick={()=>{navigate('/custmain')}}></img>
            <ul className='cust-header-menu'>
                <li onClick={()=>navigate('/custmain')} className={getActive('/custmain')}>Home</li>
                <li onClick={()=>navigate('/customer-order-history')} className={getActive('/customer-order-history')}>Order History</li>
                <li onClick={()=>navigate('/customer-profile')} className={getActive('/customer-profile')}>View Profile</li>
                <li onClick={()=>navigate('/customer-about')} className={getActive('/customer-about')}>About</li>
            </ul>

            <div className='cust-header-right'>
                <div className="search-icon">
                    <Link to={'/cart'}><img src={basketicon} alt="" /></Link>
                    <div className="dot"></div>
                </div>
                <button onClick={()=> currentOrder && navigate(`/track-delivery/${currentOrder._id}`)}
                    disabled={!currentOrder}
                    className={!currentOrder ? 'disabled' : ''}
                >Current Order</button>
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

export default CustHeader;