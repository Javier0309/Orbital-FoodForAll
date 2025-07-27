import { useParams } from "react-router-dom";
import { useEffect,useState, useRef } from "react";
import axios from "axios";

import CustomerTrackDriver from "./CustomerTrackDriver";
import CustHeader from "./CustHeader";
import DriverCard from "./DriverCard";
import Slider from "react-slick";
import CartFoodCard from './CartFoodCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TrackDelivery = () => {
    const { orderId } = useParams();                    //orderId from StoreContext.jsx's placeOrder
    const [driverId, setDriverId] = useState(null)
    const [orderDetails, setOrderDetails] = useState(null);
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/${orderId}`)
            if (res.data.success) {
                setDriverId(res.data.order.driverId)
                setOrderDetails(res.data.order)
            }
        }
        fetchOrder();
    }, [orderId])

    // Fetch business name after orderDetails is set
    useEffect(() => {
        const fetchBusinessName = async () => {
            if (orderDetails && orderDetails.businessId) {
                if (typeof orderDetails.businessId === 'object' && orderDetails.businessId.name) {
                    setBusinessName(orderDetails.businessId.name);
                } else {
                    try {
                        const id = typeof orderDetails.businessId === 'object' ? orderDetails.businessId._id : orderDetails.businessId;
                        const res = await axios.get(`http://localhost:4000/api/business/profile/${id}`);
                        if (res.data.success && res.data.business && res.data.business.name) {
                            setBusinessName(res.data.business.name);
                        } else {
                            setBusinessName('Business');
                        }
                    } catch {
                        setBusinessName('Business');
                    }
                }
            }
        };
        fetchBusinessName();
    }, [orderDetails]);

    // Debug: Log orderDetails.items and businessId
    useEffect(() => {
        if (orderDetails && orderDetails.items) {
            console.log('orderDetails.items:', orderDetails.items);
            console.log('orderDetails.businessId:', orderDetails.businessId);
        }
    }, [orderDetails]);

    // Slider settings (copied from Cart.jsx)
    const settings = {accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true, responsive: [
        { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } },
        { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
            ]};
    const sliderRef = useRef({});

    return (
        <div>
            <CustHeader/>
            <CustomerTrackDriver orderId={orderId}/>
            {driverId && <DriverCard driverId={driverId}/>} 
            {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
                <div className='cart-items' style={{margin: '40px auto', maxWidth: '1100px'}}>
                    <hr />
                    <h2>Order Summary</h2>
                    <div className="restaurant-slider">
                        <h3>{businessName}</h3>
                        <Slider ref={(ref) => (sliderRef.current['main'] = ref)} {...settings}>
                            {orderDetails.items.map((item, idx) => (
                                <CartFoodCard
                                    key={item.foodId || idx}
                                    id={item.foodId}
                                    name={item.name}
                                    desc={item.desc}
                                    quantity={item.quantity}
                                    cookedAt={item.cookedAt}
                                    consumeBy={item.consumeBy}
                                    comment={item.comment}
                                    image={item.image}
                                    businessId={orderDetails.businessId}
                                    hideControls={true}
                                />
                            ))}
                        </Slider>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrackDelivery
