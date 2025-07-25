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
                )}
            </div>
        </div>
    );
}

export default CustomerTrackDriver;

