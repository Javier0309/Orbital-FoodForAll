import { useEffect,useState } from "react";
import 'leaflet/dist/leaflet.css'
import OrderMap from './OrderMap'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustMain.css';
import Slider from "react-slick";
import CartFoodCard from './CartFoodCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomerTrackDriver = ({orderId}) => {

    const [orderDetails , setOrderDetails ] = useState(null);
    const navigate = useNavigate();
    const [showNoRiderPopup, setShowNoRiderPopup] = useState(false);
    const [searchTimer, setSearchTimer] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                //const email = localStorage.getItem('email');
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`)
                const data = await res.json();
                if (data.success) setOrderDetails(data.order)
            } catch (error) {
                console.error("Error fetching order details:", error)
            }
        }

        fetchOrderDetails();
        
        // Set up polling to automatically refresh order details every 5 seconds
        const interval = setInterval(fetchOrderDetails, 5000);
        
        return () => clearInterval(interval);
    }, [orderId])

    // Timer for delivery orders
    useEffect(() => {
        if (
            orderDetails &&
            orderDetails.deliveryMode === 'delivery' &&
            orderDetails.deliveryStatus === 'pending'
        ) {
            // Start 90s timer
            const timer = setTimeout(() => {
                setShowNoRiderPopup(true);
            }, 90000);
            setSearchTimer(timer);
            return () => clearTimeout(timer);
        }
        // Clean up timer if order assigned or status changes
        return () => searchTimer && clearTimeout(searchTimer);
    }, [orderDetails]);



    return (
        <div className="track-delivery-container">
            <div className="track-delivery-card">
                <h3 style={{color: '#594842', fontWeight: 700, fontSize: '2rem', marginBottom: '18px'}}>Tracking your Order</h3>
                {orderDetails && orderDetails.status === 'rejected' ? (
                    <div style={{marginTop: '16px', padding: '24px', background: '#fee2e2', borderRadius: '12px', color: '#b91c1c', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                        <h4 style={{marginBottom: '10px'}}>Your order has been rejected by the restaurant:</h4>
                        <p>{orderDetails.rejectionReason || 'No reason provided.'}</p>
                        <button
                            className="track-btn"
                            style={{ fontWeight: 'normal' }}
                            onClick={async () => {
                                await axios.patch(`http://localhost:4000/api/order/customer/remove/${orderDetails._id}`);
                                navigate('/custmain');
                            }}
                        >
                            See Other Food
                        </button>
                    </div>
                ) : orderDetails && (
                    <>
                        <div style={{marginBottom: '10px', color: '#594842', fontWeight: 600, fontSize: '1.1rem'}}>
                            Order ID: {orderDetails._id}
                        </div>
                        <div style={{marginBottom: '18px', color: '#594842', fontWeight: 500}}>
                            {orderDetails.deliveryStatus === 'in_transit' ? 'Your order is on the way!' :
                                orderDetails.deliveryStatus === 'delivered' ? 'Your order has arrived' :
                                orderDetails.deliveryStatus === 'assigned' ? 'Found a rider!' :
                                orderDetails.deliveryMode === 'pickup' ? 'Self Pickup: Head to the restaurant!' :
                                'Looking for rider...'}
                        </div>
                        {/* Self-pickup: show not ready message if not ready */}
                        {orderDetails.deliveryMode === 'pickup' && orderDetails.status !== 'ready' && (
                          <div style={{marginBottom: '8px', fontWeight: 'bold', color: '#b91c1c', fontSize: '1.1rem'}}>
                            Your food is not ready for collection yet. Please wait for the business to mark it as ready.
                          </div>
                        )}
                        {/* Collected button and ready message above the map for self-pickup orders marked as ready */}
                        {orderDetails.deliveryMode === 'pickup' && orderDetails.status === 'ready' && (
                          <>
                            <div style={{marginBottom: '8px', fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem'}}>
                              Your food is ready for collection!
                            </div>
                            <button
                              className="track-btn track-btn-green"
                              onClick={async () => {
                                await axios.patch(`http://localhost:4000/api/business/orders/${orderDetails._id}/status`, { status: "completed" });
                                // Redirect to review restaurant page
                                const businessId = typeof orderDetails.businessId === 'object' ? orderDetails.businessId._id : orderDetails.businessId;
                                navigate(`/restaurant/${businessId}/review`, {
                                  state: { restaurant: orderDetails.businessId }
                                });
                              }}
                            >
                              Collected
                            </button>
                          </>
                        )}
                        
                        {/* Review Restaurant button for delivered orders */}
                        {orderDetails.deliveryStatus === 'delivered' && (
                          <>
                            <button
                              className="track-btn track-btn-green"
                              onClick={() => {
                                const businessId = typeof orderDetails.businessId === 'object' ? orderDetails.businessId._id : orderDetails.businessId;
                                navigate(`/restaurant/${businessId}/review`, {
                                  state: { restaurant: orderDetails.businessId }
                                });
                              }}
                            >
                              Review Restaurant
                            </button>
                          </>
                        )}
                        <div style={{margin: '24px 0'}}>
                            <div className="track-map-wrapper">
                                <OrderMap orderId={orderId} pickupMode={orderDetails.deliveryMode === 'pickup'} />
                            </div>
                        </div>
                        {/* No rider found popup */}
                        {showNoRiderPopup && (
                          <div className="track-popup-overlay">
                            <div className="track-popup-card">
                              <h2 style={{color: '#594842'}}>No rider found</h2>
                              <p style={{color: '#594842'}}>Would you like to switch to self-pickup or keep searching for a rider?</p>
                              <div style={{marginTop: '24px', display: 'flex', gap: '18px', justifyContent: 'center'}}>
                                <button
                                  className="track-btn"
                                  onMouseOver={e => e.currentTarget.style.background = '#f4c7c1'}
                                  onMouseOut={e => e.currentTarget.style.background = 'rgb(244, 163, 149)'}
                                  onClick={async () => {
                                    await axios.patch(`http://localhost:4000/api/order/${orderDetails._id}/switch-to-pickup`);
                                    setShowNoRiderPopup(false);
                                    window.location.reload();
                                  }}
                                >
                                  Self-pickup
                                </button>
                                <button
                                  className="track-btn"
                                  onMouseOver={e => e.currentTarget.style.background = '#f4c7c1'}
                                  onMouseOut={e => e.currentTarget.style.background = 'rgb(244, 163, 149)'}
                                  onClick={() => {
                                    setShowNoRiderPopup(false);
                                    setSearchTimer(setTimeout(() => setShowNoRiderPopup(true), 90000));
                                  }}
                                >
                                  Retry
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default CustomerTrackDriver;