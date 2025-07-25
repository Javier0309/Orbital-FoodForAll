import './CustMain.css'
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/foodforall logo.png'
import basketicon from '../../assets/basketicon.png'
import { supabase } from '../../../backend/SupabaseClient';

function CustHeader() {
    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();
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
                <li onClick={()=>{setMenu("about"); navigate('/customer-about')}} className={menu==="about"?"active":""}>About</li>
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
            </div>
        </div>
    );
}

export default CustHeader;