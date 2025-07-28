import './CustMain.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext } from 'react'
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CartFoodCard({id,name,desc,image, quantity, businessId, cookedAt, consumeBy, hideControls}){    //props passed from Cart.jsx
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
        addToCart(id, cartItems[id]?.comment || "");
    };
    

    return(
        <>
        <div className='foodcard'> 
            <div className='content'>
                <div style={{ position: 'relative', width: '100%' }}>
                    <img className='card-image' src={url+"/uploads/"+image} alt="" />
                    {hideControls && (
                        <span style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: '#f4c7c1',
                            color: '#594842',
                            borderRadius: '50%',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                        }}>{quantity}</span>
                    )}
                </div>
                <h2 className='card-title'>{name}</h2>
                <p className='card-text'>{cartItems[id]?.comment && cartItems[id]?.comment.length > 30 ? cartItems[id]?.comment.slice(0,30) + '...' : cartItems[id]?.comment}</p>
                {!hideControls && (
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