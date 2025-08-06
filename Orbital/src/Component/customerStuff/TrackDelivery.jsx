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
    const [driversOnline, setDriversOnline] = useState(0);

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

    // Fetch drivers online count
    useEffect(() => {
        const fetchDriversOnline = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/driver/online-count');
                if (res.data.success) {
                    setDriversOnline(res.data.count);
                }
            } catch (error) {
                console.error('Error fetching drivers online:', error);
            }
        };

        fetchDriversOnline();
        // Refresh every 30 seconds
        const interval = setInterval(fetchDriversOnline, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSwitchToPickup = async () => {
        try {
            await axios.patch(`http://localhost:4000/api/order/${orderId}/switch-to-pickup`);
            window.location.reload();
        } catch (error) {
            console.error('Error switching to pickup:', error);
        }
    };

    // Slider settings (copied from Cart.jsx)
    const settings = {accessibility: true,dots: false, infinite: false, speed: 500, slidesToShow: 4, slidesToScroll: 1, arrows: true, responsive: [
        { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 1, variableWidth: true } },
        { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
            ]};
    const sliderRef = useRef({});

    return (
        <div>
            <CustHeader/>
            
            {/* Drivers Online and Pickup Option */}
            {orderDetails && orderDetails.deliveryMode === 'delivery' && orderDetails.deliveryStatus === 'pending' && (
                <div style={{
                    maxWidth: '1100px',
                    margin: '20px auto',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div style={{ fontSize: '16px', color: '#495057' }}>
                            <strong>{driversOnline}</strong> drivers online
                        </div>
                        <button
                            onClick={handleSwitchToPickup}
                            style={{
                                background: 'rgb(244, 163, 149)',
                                color: 'black',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Switch to Pickup
                        </button>
                    </div>
                </div>
            )}
            
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
