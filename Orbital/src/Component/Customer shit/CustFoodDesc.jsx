import './CustMain.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react';
import FoodCard from './FoodCard';
import CustHeader from './CustHeader';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CustFoodDesc(){

    const navigate = useNavigate();
    const { state } = useLocation();
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);
    

    if (!state) {
        return <p>Error: No food data found</p>
    }
    const {id, name, desc, image} = state;

    return(
        <>
            <CustHeader/>
            <div>
                <img className='card-image' src={url+"/images/"+image} alt=""/>
                <div>
                    <h2 className='card-title'>{name}</h2>
                    <p className='card-text'>{desc}</p>
                    <div className='food-qty'>
                        <img onClick={()=>removeFromCart(id)} src={Minus} alt=""/>
                        <div>{cartItems[id]}</div>
                        <img onClick={()=>addToCart(id)} src={Plus} alt=""/>
                    </div>
                    <h2>Momo's Buffet Diner</h2>
                    <button>View Restaurant</button>
                </div>
            </div>

        </>
    )
}


export default CustFoodDesc;

