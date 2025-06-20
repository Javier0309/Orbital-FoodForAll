import { useContext, useRef, useEffect } from "react";
import './CustMain.css'
import FoodCard from "./FoodCard.jsx";
import { StoreContext } from "./StoreContext";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)
    const settings = {accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true, responsive: [
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

    return (
        <div id='food-display' className="food-display">
        <h2>Food near you, for you</h2>
            <div className='food-display-list'>
                <Slider ref={sliderRef} {...settings}>
                {food_list.map((item,index) => {
                    return <FoodCard key={index} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} image={item.image}/>
                })}
                </Slider>
            </div>
        </div>

    )
}

export default FoodDisplay