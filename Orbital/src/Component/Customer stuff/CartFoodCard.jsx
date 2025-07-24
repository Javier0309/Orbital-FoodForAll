import './CustMain.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react'
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CartFoodCard({id,name,desc,image, quantity, businessId, cookedAt, consumeBy, comment, hideControls}){    //props passed from Cart.jsx
    const navigate = useNavigate();
    const handleClick = () => navigate('/cust-food-desc', {
        state: {id, name, desc, image, quantity, businessId, cookedAt, consumeBy, comment: cartItems[id]?.comment || ""}
    });
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);

    
    const handleAddToCart = () => {
        const currentCartQty = cartItems[id]?.quantity || 0;
        if (currentCartQty >= quantity) {
            alert(`Cannot add more items. Only ${quantity} available.`);
            return;
        } 
        addToCart(id, comment);
    };
    

    return(
        <>
        <div className='foodcard'> 
            <div className='content'>
                <img className='card-image' src={url+"/uploads/"+image} alt=""></img>
                <h2 className='card-title'>{name}</h2>
                <p className='card-text'>{comment && comment.length > 30 ? comment.slice(0,30) + '...' : comment}</p>
                {hideControls ? (
                  <div className='food-qty' style={{justifyContent: 'center', alignItems: 'center', gap: '12px', height: '40px'}}>
                    <span style={{fontWeight: 600, fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>{quantity}</span>
                  </div>
                ) : (
                  <div className='food-qty'>
                    <img onClick={()=>removeFromCart(id)} src={Minus} alt=""/>
                    <div>{cartItems[id]?.quantity}</div>
                    <img onClick={handleAddToCart} src={Plus} alt=""/>
                  </div>
                )}
                {!hideControls && (
                  <p style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>
                    Available: {quantity} items
                  </p>
                )}
                {/*<button className='card-button'>Add to Cart</button>*/}
            </div>

            {!hideControls && <div className="overlay" onClick={handleClick}/>} 
        </div>
        </>
    )
}

export default CartFoodCard;