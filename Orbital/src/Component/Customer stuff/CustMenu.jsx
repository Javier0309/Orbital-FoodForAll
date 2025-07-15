import React from 'react';
import { useContext, useRef, useEffect, useState } from "react";
import './CustMain.css'
import FoodCard from "./FoodCard.jsx";
import { StoreContext } from "./StoreContext.jsx";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const FoodDisplay = () => {

    const {food_list} = useContext(StoreContext)

    //search bar
    const [searchQuery, setSearchQuery] = useState("")

    const settings = {accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 1, arrows: true, responsive: [
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
    }, [food_list]);

    const filteredFood = food_list.filter(item => 
        ((item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))) && 
        item.quantity > 0
    )

    const groupedFood = filteredFood.reduce((acc, item) => {
        const key = item.businessId?._id || 'unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {})

    return (
        <div id='food-display' className="food-display">
        <h2>Food near you, for you</h2>

        <div className="search-bar">
            <input 
                type = "text"
                placeholder="Search food..."
                value = {searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>

        {Object.entries(groupedFood).map(([businessId, items]) => (
            <div key={businessId} className="restaurant-slider">
                <h3>{items[0].businessId?.name}</h3>
                {/*<div className='food-display-list'>*/}
                <Slider ref={(ref) => (sliderRef.current[businessId] = ref)} {...settings}>
                {items.map((item) => {
                    return <FoodCard key={item._id} id={item._id} name={item.name} desc={item.desc} quantity={item.quantity} cookedAt={item.cookedAt} consumeBy={item.consumeBy} comment={item.comment} image={item.image} businessId={item.businessId}/>
                })}
                </Slider>
            </div>
        ))}
        </div>

    )
}

export default FoodDisplay