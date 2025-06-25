import './CustMain.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react'
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CartFoodCard({id,name,desc,image,quantity}){
    const navigate = useNavigate();
    const handleClick = () => navigate('/cust-food-desc', {
        state: {id, name, desc, image, quantity}
    });
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);

    const handleAddToCart = () => {
        const currentCartQty = cartItems[id] || 0;
        if (currentCartQty >= quantity) {
            alert(`Cannot add more items. Only ${quantity} available.`);
            return;
        }
        addToCart(id);
    };

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
                    <img onClick={handleAddToCart} src={Plus} alt=""/>
                </div>
                <p style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>
                    Available: {quantity} items
                </p>
                {/*<button className='card-button'>Add to Cart</button>*/}
            </div>

            <div className="overlay" onClick={handleClick}/>
        </div>
        </>
    )
}

export default CartFoodCard;