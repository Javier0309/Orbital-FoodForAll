import './CustMain.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react'
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CartFoodCard({id,name,desc,image}){
    const navigate = useNavigate();
    const handleClick = () => navigate('/cust-food-desc', {
        state: {id, name, desc, image}
    });
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);


    return(
        <>
        <div className='foodcard'> 
            <div className='content'>
                <img className='card-image' src={url+"/images/"+image} alt=""></img>
                <h2 className='card-title'>{name}</h2>
                <p className='card-text'>{desc}</p>
                <div className='food-qty'>
                    <img onClick={()=>removeFromCart(id)} src={Minus} alt=""/>
                    <div>{cartItems[id]}</div>
                    <img onClick={()=>addToCart(id)} src={Plus} alt=""/>
                </div>
                {/*<button className='card-button'>Add to Cart</button>*/}
            </div>

            <div className="overlay" onClick={handleClick}/>
        </div>
        </>
    )
}

export default CartFoodCard;