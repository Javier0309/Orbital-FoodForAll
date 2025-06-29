import './CustMain.css';
import CustHeader from './CustHeader';
import CartFoodCard from './CartFoodCard';
import { useContext,useRef,useEffect,useState } from 'react'
import { StoreContext } from './StoreContext';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Cart = () => {
    const {cartItems, food_list, removeFromCart, placeOrder} = useContext(StoreContext);

    const settings = {centerMode: false, accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true, responsive: [
        {breakpoint: 704, settings: {slidesToShow: 2, slidesToScroll: 1}},
        {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}},
        {breakpoint: 1280, settings: {slidesToShow: 3, slidesToScroll: 1}},
    ]};
    const sliderRef = useRef({});
    
    useEffect(() => {
        const listeners = [];
        Object.values(sliderRef.current).forEach((slider) => {

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

    const [collect, setCollect] = useState("pickup");

    return (
        <div className='cart'>
            <CustHeader/>
            <h2>My Cart</h2>
            <div className='cart-items'>
                {Object.entries(groupedFood).map(([businessId, items]) => (
                    <div key={businessId} className="restaurant-slider">
                    <h3>{items[0].businessId?.name}</h3>
                    <Slider ref={(ref) => (sliderRef.current[businessId] = ref)} {...settings}>
                    {items.map((item)=>{
                        if(cartItems[item._id]?.quantity>0) {
                            return(
                                <CartFoodCard key={item._id} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} cookedAt={item.cookedAt} consumeBy={item.consumeBy} comment={cartItems[item._id]?.comment || ""} image={item.image} businessId={item.businessId}/>
                            )
                        }
                    })}
                    </Slider>
                    <hr />
                    </div>
                ))}
            </div>

            <div className="cart-bottom">
                <ul className='collect-option'>
                <li onClick={()=>setCollect("pickup")} className={collect==="pickup"?"active":""}>Pickup</li>
                <li onClick={()=>setCollect("delivery")} className={collect==="delivery"?"active":""}>Delivery</li>
                </ul>

                <button className="submit" onClick={()=>placeOrder(collect)} disabled={Object.keys(cartItems).length === 0}>Place Order</button>
            </div>
        </div>
    )
}



export default Cart;