import './CustMain.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './StoreContext';
import { useContext, useState, useEffect } from 'react';
import CustHeader from './CustHeader';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';

function CustFoodDesc(){

    const navigate = useNavigate();
    const { state } = useLocation();
    const [comment, setComment] = useState('')
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);

    if (!state) {
        return <p>Error: No food data found</p>
    }
    const {id, name, desc, image, quantity, businessId, cookedAt, consumeBy} = state;
    
    const initialQty = () => (Number(cartItems[id]) || 1);
    const [localQty, setLocalQty] = useState(initialQty)

    useEffect(() => {
        const qty = Number(cartItems[id] || 1);
        setLocalQty(qty)
    }, [cartItems, id])

    return(
        <>
            <CustHeader/>
            <div>
                <div className='custfooddesc'>
                <div className='bg'> 
                <img className='card-image' src={url+"/images/"+image} alt=""/>
                <div className='business-stuff'>
                    <h3>{businessId?.name}</h3>
                    <button>View Restaurant</button>
                </div>
            
                <div className='food-desc-content'>
                    <h1 className='card-title'>{name}</h1>
                    <p className='card-text'><strong>Ingredients: </strong>{desc}</p>
                </div>
                </div>
                    <p><strong>Cooked at: </strong> {new Date(cookedAt).toLocaleString()}</p>
                    <p><strong>Consume by: </strong>{new Date(consumeBy).toLocaleString()}</p>

                    <div className='food-qty'>
                        <p>Serving size (no. of people): </p>
                        <img onClick={()=>setLocalQty(prev => Math.max(Number(prev) - 1, 1))} src={Minus} alt=""/>
                        <div>{localQty}</div>
                        <img onClick={()=>setLocalQty(prev => Math.min(Number(prev) + 1, quantity))} src={Plus} alt=""/>
                        <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}> Available: {quantity} items</p>
                    </div>

                    <label htmlFor="comment">Add a note to the restaurant</label>
                    <textarea id='comment' placeholder='e.g. No onions' value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                        style={{width: "100%", padding: "18px", marginTop: "8px"}}/>
                    <button className='card-button' onClick={() => {
                        const alreadyInCart = cartItems[id] || 0
                        const totalRequested = localQty;

                        if (totalRequested > quantity) {
                            alert(`Requested quantity (${totalRequested}) exceeds what restaurant can supply (${quantity} available)`)
                            return;
                        }

                        const safeQtyToAdd = totalRequested - alreadyInCart
                        if (safeQtyToAdd > 0){
                            for (let i = 0; i < safeQtyToAdd; i++){
                                addToCart(id)
                            }
                            alert("Item(s) added to basket")
                        } else if (safeQtyToAdd === 0) {
                            alert("This quantity is already in your basket")

                        } else {
                            alert("Please reduce the quantity to add to basket")
                        }
                    }
                    }>Add to basket</button>
                </div>
            </div>
            

        </>
    )
}


export default CustFoodDesc;

