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
    const {id, name, desc, image, quantity, businessId, cookedAt, consumeBy, comment: stateComment} = state;
    const {url, cartItems, addToCart, removeFromCart} = useContext(StoreContext);
    const [localComment, setLocalComment] = useState(cartItems[id]?.comment ?? stateComment ?? '')


    if (!state) {
        return <p>Error: No food data found</p>
    }
    
    const initialQty = () => (Number(cartItems[id]?.quantity) || 1);
    const [localQty, setLocalQty] = useState(initialQty)

    useEffect(() => {
        const qty = Number(cartItems[id]?.quantity || 1);
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
                    <h3>{businessId?.name}'s</h3>
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
                    <textarea id='comment' placeholder='e.g. No onions' value={localComment} onChange={(e) => setLocalComment(e.target.value)} rows={3}
                        style={{width: "100%", padding: "18px", marginTop: "8px"}}/>
                        
                    <button className='card-button' onClick={() => {
                        const alreadyInCart = cartItems[id]?.quantity || 0
                        const totalRequested = localQty;

                        if (totalRequested > quantity) {
                            alert(`Requested quantity (${totalRequested}) exceeds what restaurant can supply (${quantity} available)`)
                            return;
                        }

                        if (alreadyInCart === totalRequested) {
                            addToCart(id, localComment)
                            removeFromCart(id)
                            alert("Basket updated")
                            return;
                        }

                        if (totalRequested > alreadyInCart) {
                            const safeQtyToAdd = totalRequested - alreadyInCart;
                            for (let i = 0; i < safeQtyToAdd; i++){
                                addToCart(id, localComment)
                            }
                            alert("Item(s) added to basket")
                            return
                        }

                        if (totalRequested < alreadyInCart) {
                            const safeQtyToRemove = alreadyInCart - totalRequested;
                            for (let i = 0; i < safeQtyToRemove; i++){
                                removeFromCart(id)
                            }
                            alert("Item(s) removed from basket")
                            return;
                        }
                    }
                    }>Update basket</button>
                </div>
            </div>
            

        </>
    )
}

export default CustFoodDesc;

