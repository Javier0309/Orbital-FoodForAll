import './CustMain.css';
import CustHeader from './CustHeader';
import CartFoodCard from './CartFoodCard';
import { useContext,useRef,useEffect,useState } from 'react'
import { StoreContext } from './StoreContext';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Cart = () => {

    const settings = {centerMode: false, accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true, responsive: [
        {breakpoint: 704, settings: {slidesToShow: 2, slidesToScroll: 1}},
        {breakpoint: 480, settings: {slidesToShow: 1, slidesToScroll: 1}},
        {breakpoint: 1280, settings: {slidesToShow: 3, slidesToScroll: 1}},
    ]};
    const sliderRef = useRef();
    
    useEffect(() => {
        const slider = sliderRef.current;
    
        if (!slider) return;
    
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
    
        const sliderE1 = slider.innerSlider?.list;
        if (sliderE1) {
            sliderE1.addEventListener('wheel', handleWheel, {passive: false});
        }
    
        return () => {
            if (sliderE1) {
                sliderE1.removeEventListener('wheel', handleWheel);
            }
        }
    }, []);

    const {cartItems, food_list, removeFromCart} = useContext(StoreContext);

    const [collect, setCollect] = useState("pickup");

    return (
        <div className='cart'>
            <CustHeader/>
            <div className='cart-items'>
                <br />
                <hr />
                <div className='cart-items-list'>
                <h3>Momo's Buffet Diner</h3>
                <Slider ref={sliderRef} {...settings}>
                {food_list.map((item,index)=>{
                    if(cartItems[item._id]>0) {
                        return(
                            <CartFoodCard key={index} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} image={item.image}/>
                        )
                    }
                })}
                </Slider>
                <hr />
                </div>
            </div>

            <div className="cart-bottom">
                <ul className='collect-option'></ul>
                <li onClick={()=>setCollect("pickup")} className={collect==="pickup"?"active":""}>Pickup</li>
                <li onClick={()=>setCollect("delivery")} className={collect==="delivery"?"active":""}>Delivery</li>
            </div>
        </div>
    )
}



export default Cart;