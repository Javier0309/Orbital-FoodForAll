import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import CustomerTrackDriver from "./CustomerTrackDriver";
import CustHeader from "./CustHeader";
import DriverCard from "./DriverCard";
import Slider from "react-slick";
import CartFoodCard from './CartFoodCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TrackDelivery = () => {
    const { orderId } = useParams();
    const [driverId, setDriverId] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [businessName, setBusinessName] = useState('');
    const [businessObj, setBusinessObj] = useState(null);
    const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
    const navigate = useNavigate();
    const sliderRef = useRef({});

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/${orderId}`);
            if (res.data.success) {
                setDriverId(res.data.order.driverId);
                setOrderDetails(res.data.order);
            }
        };
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        const fetchBusinessData = async () => {
            if (orderDetails && orderDetails.businessId) {
<<<<<<< HEAD
                const businessId = typeof orderDetails.businessId === "object"
                    ? orderDetails.businessId._id
                    : orderDetails.businessId;
                try {
                    const res = await axios.get(`http://localhost:4000/api/business/profile/${businessId}`);
                    if (res.data.success && res.data.business) {
                        setBusinessName(res.data.business.name || 'Business');
                        setBusinessObj(res.data.business);
                    } else {
=======
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
>>>>>>> d609edb9152fce127253cf98aae254fbb5ce321b
                        setBusinessName('Business');
                        setBusinessObj(null);
                    }
<<<<<<< HEAD
                } catch {
                    setBusinessName('Business');
                    setBusinessObj(null);
=======
>>>>>>> d609edb9152fce127253cf98aae254fbb5ce321b
                }
            }
        };
        fetchBusinessData();
    }, [orderDetails]);

    const handleViewRestaurant = () => {
        if (!businessObj || !businessObj._id) {
            alert('Restaurant information not available');
            return;
        }
        navigate(`/restaurant/${businessObj._id}`, { state: { restaurant: businessObj } });
    };
    const handleReviewRestaurant = () => {
        if (!businessObj || !businessObj._id) {
            alert('Restaurant information not available');
            return;
        }
        navigate(`/restaurant/${businessObj._id}/review`, { state: { restaurant: businessObj } });
    };

    const handleConfirmDelivery = () => {
        setDeliveryConfirmed(true);
        setTimeout(() => {
            navigate("/custmain"); // go back to CustMain page
        }, 800); 
    };

<<<<<<< HEAD
    const settings = {
        centerMode: false,
        accessibility: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 704, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        ]
    };

    return (
        <div>
            <CustHeader />
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <CustomerTrackDriver orderId={orderId} />
                {driverId && <DriverCard driverId={driverId} />}
=======
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
>>>>>>> d609edb9152fce127253cf98aae254fbb5ce321b

                {/* Restaurant actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", margin: "24px 0" }}>
                    <button
                        className="order-btn"
                        style={{ background: "#a86130", color: "#fff", borderRadius: "9px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
                        onClick={handleViewRestaurant}
                    >
                        🍽️ View Restaurant
                    </button>
                    <button
                        className="order-btn"
                        style={{ background: "#c17a4d", color: "#fff", borderRadius: "9px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
                        onClick={handleReviewRestaurant}
                    >
                        ⭐ Review Restaurant
                    </button>
                </div>

                {/* Confirm Delivery Button (frontend only) */}
                {orderDetails && orderDetails.deliveryStatus === "delivered" && !deliveryConfirmed && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                        <button
                            className="order-btn"
                            style={{
                                background: "#38b000",
                                color: "#fff",
                                borderRadius: "9px",
                                padding: "14px 42px",
                                fontWeight: 700,
                                fontSize: "1.15rem",
                                cursor: deliveryConfirmed ? "not-allowed" : "pointer",
                                boxShadow: "0 2px 8px rgba(56,176,0,0.08)"
                            }}
                            onClick={handleConfirmDelivery}
                            disabled={deliveryConfirmed}
                        >
                            {deliveryConfirmed ? "Delivery Confirmed!" : "✅ Confirm Delivery"}
                        </button>
                    </div>
                )}
                {/* Success message if just confirmed */}
                {deliveryConfirmed && (
                    <div style={{ textAlign: "center", color: "#38b000", fontWeight: 600, fontSize: "1.2rem", marginBottom: "25px" }}>
                        Delivery Confirmed! Redirecting...
                    </div>
                )}

                {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
                    <div className='cart-items' style={{ margin: '40px auto', maxWidth: '1100px' }}>
                        <hr />
                        <h2>Order Summary</h2>
                        <div className="restaurant-slider">
                            <h3>{businessName}</h3>
                            <Slider ref={ref => (sliderRef.current['main'] = ref)} {...settings}>
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
        </div>
    );
};

export default TrackDelivery;