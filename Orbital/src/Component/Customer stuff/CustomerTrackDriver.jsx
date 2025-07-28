import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'
import OrderMap from './OrderMap'

const CustomerTrackDriver = ({ orderId }) => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`);
                const data = await res.json();
                if (data.success) setOrderDetails(data.order);
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        fetchOrderDetails();
<<<<<<< HEAD
=======
        
        // Set up polling to automatically refresh order details every 5 seconds
        const interval = setInterval(fetchOrderDetails, 5000);
        
        return () => clearInterval(interval);
    }, [orderId])
>>>>>>> d609edb9152fce127253cf98aae254fbb5ce321b

        socketRef.current = io("http://localhost:4000");

        socketRef.current.on(`location-${orderId}`, (location) => {
            setDriverLocation(location);
        });

        return () => { if (socketRef.current) socketRef.current.disconnect(); }
    }, [orderId]);



    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <h3 className="tracking-title">🚚 Tracking Your Order</h3>
                <div className="tracking-status">
                    <span className="status-indicator active"></span>
                    <span>Live Tracking Active</span>
                </div>
            </div>

            <div className="tracking-content">
                <div className="map-section">
                    <OrderMap orderId={orderId} />
                </div>

                {orderDetails && (
                    <div className="order-info-card">
                        <div className="order-header">
                            <h4>📦 Order Details</h4>
                            <span className="order-id">#{orderDetails._id.slice(-8)}</span>
                        </div>

                        <div className="order-status">
                            <div className="status-badge">
                                <span className="status-dot"></span>
                                {orderDetails.deliveryStatus || 'pending'}
                            </div>
                        </div>

                        <div className="order-items">
                            <h5>Items Ordered:</h5>
                            <ul>
                                {orderDetails.items?.map((item, index) => (
                                    <li key={index} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                        {item.comment && <span className="item-comment">"{item.comment}"</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="delivery-info">
                            <p><strong>Delivery Mode:</strong> {orderDetails.deliveryMode}</p>
                            <p><strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="driver-info">
                            <div className="driver-badge">
                                <span className="driver-icon">👨‍💼</span>
                                <span>Driver Assigned</span>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
=======
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
>>>>>>> d609edb9152fce127253cf98aae254fbb5ce321b
                )}
            </div>
        </div>
    );
}

export default CustomerTrackDriver;

