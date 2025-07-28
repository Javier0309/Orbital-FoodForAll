import './CustMain.css';
import CustHeader from './CustHeader';
import CartFoodCard from './CartFoodCard';
import { useContext,useRef,useEffect,useState } from 'react'
import { StoreContext } from './StoreContext';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import halalIcon from '../../assets/halal symbol.png';

const Cart = () => {
    const {cartItems, food_list, removeFromCart, placeOrder} = useContext(StoreContext);

    const settings = {accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true, responsive: [
        { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } },
        { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
            ]};
    const sliderRef = useRef({});
    
    useEffect(() => {
        const listeners = [];
        Object.values(sliderRef.current).forEach((slider) => {
            if (!slider || !slider.innerSlider) return;
            const sliderE1 = slider.innerSlider?.list;
            if (!sliderE1)  return;
            
            const handleWheel = (e) => {
                e.preventDefault();
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)){
                    if (e.deltaX > 0) {
                        slider.slickNext();
                    } else if (e.deltaX < 0) {
                        slider.slickPrev();
                    } 
                }
            };
            
            sliderE1.addEventListener('wheel', handleWheel, {passive: false});
            listeners.push({ sliderE1, handleWheel })
        })

        return () => {
            listeners.forEach(({ sliderE1, handleWheel }) => {
                sliderE1.removeEventListener('wheel', handleWheel);
            });
        }
    }, [cartItems]);

    const cartFoodItems = food_list.filter(food => cartItems[food._id]?.quantity > 0)
    const groupedFood = cartFoodItems.reduce((acc, item) => {
        const key = item.businessId?._id || 'unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {})

    const [collect, setCollect] = useState(null); // No default selection

    return (
        <>
        <CustHeader/>
        <div className='cart'>
            <h2>My Cart</h2>
            <div className='cart-items'>
                {Object.entries(groupedFood).map(([businessId, items]) => (
                    <div key={businessId} className="restaurant-slider">
                    <h3>
                      {items[0].businessId?.name}
                      {items[0].businessId?.halalCertUrl && (
                        <img src={halalIcon} alt="Halal" style={{height: 24, marginLeft: 8, verticalAlign: 'middle'}} />
                      )}
                    </h3>
                    <Slider ref={(ref) => (sliderRef.current[businessId] = ref)} {...settings}>
                    {items.map((item)=>{
                        if(cartItems[item._id]?.quantity>0) {
                            return(
                                <CartFoodCard key={item._id} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} cookedAt={item.cookedAt} consumeBy={item.consumeBy} image={item.image} businessId={item.businessId}/>
                            )
                        }
                    })}
                    </Slider>
                    <hr />
                    </div>
                ))}
            </div>

            <div className="cart-bottom">
                <ul className='collect-option' style={{display: 'flex', gap: 16, padding: 0, margin: 0, listStyle: 'none'}}>
                  <li
                    onClick={() => setCollect("pickup")}
                    className={collect === "pickup" ? "active" : ""}
                    style={{
                      background: collect === "pickup" ? '#f4a395' : '#f3e8e3',
                      color: collect === "pickup" ? '#222' : '#888',
                      border: collect === "pickup" ? '2px solid #f4a395' : '2px solid #e0e0e0',
                      borderRadius: 4,
                      padding: '10px 32px',
                      fontSize: 18,
                      cursor: 'pointer',
                      transition: 'background 0.2s, color 0.2s, border 0.2s',
                    }}
                  >
                    Pickup
                  </li>
                  <li
                    onClick={() => setCollect("delivery")}
                    className={collect === "delivery" ? "active" : ""}
                    style={{
                      background: collect === "delivery" ? '#f4a395' : '#f3e8e3',
                      color: collect === "delivery" ? '#222' : '#888',
                      border: collect === "delivery" ? '2px solid #f4a395' : '2px solid #e0e0e0',
                      borderRadius: 4,
                      padding: '10px 32px',
                      fontSize: 18,
                      cursor: 'pointer',
                      transition: 'background 0.2s, color 0.2s, border 0.2s',
                    }}
                  >
                    Delivery
                  </li>
                </ul>

                <button
                  className="submit"
                  onClick={() => placeOrder(collect)}
                  disabled={Object.keys(cartItems).length === 0 || !collect}
                  style={{
                    background: '#f4a395',
                    color: '#222',
                    border: 'none',
                    borderRadius: 32,
                    fontSize: 20,
                    padding: '14px 40px',
                    marginTop: 18,
                    cursor: Object.keys(cartItems).length === 0 || !collect ? 'not-allowed' : 'pointer',
                    opacity: Object.keys(cartItems).length === 0 || !collect ? 0.6 : 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    transition: 'background 0.2s, color 0.2s, opacity 0.2s',
                  }}
                >
                  Place Order
                </button>
            </div>
        </div>
        </>
    )
}



export default Cart;