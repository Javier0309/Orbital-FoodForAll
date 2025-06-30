import { useEffect,useState } from "react";
import axios from 'axios'
import './DriverMain.css'

const AvailableOrders = () => {
    const driverId = localStorage.getItem("driverId"); 
    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        axios.post('http://localhost:4000/api/order/driver/available-orders')
        .then(res => setOrders(res.data.orders))
        .catch(err => console.error(err))
    }, [])

    const handleAccept = async (orderId) => {
        try {
            await axios.post('http://localhost:4000/api/order/driver/self-assign', {driverId, orderId});
            alert('Order accepted!');
            window.location.reload();
        } catch (error) {
            alert('Failed to accept order: ' + (error.response?.data?.message || error.message));
        }
    }

    return (
        <div className="available-orders">
            <div className="orders-header">
                <h3 className="orders-title">🚚 Available Orders</h3>
                <span className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''} available</span>
            </div>
            
            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">⏳</div>
                    <p>No available orders</p>
                    <span>New orders will appear here</span>
                </div>
            ) : (
                <div className="orders-grid">
                    {orders.map(order => (
                        <div key={order._id} className="order-card available">
                            <div className="order-header">
                                <span className="order-id">#{order._id.slice(-8)}</span>
                                <div className="status-badge pending">
                                    pending
                                </div>
                            </div>

                            <div className="business-info">
                                <h4 className="business-name">{order.businessId?.name}</h4>
                                <p className="business-address">{order.businessId?.address}</p>
                            </div>

                            <div className="order-items">
                                <h5>Items:</h5>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index} className="order-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty"> x{item.quantity}</span>
                                            {item.comment && (
                                                <span className="item-comment">"{item.comment}"</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="order-details">
                                <p><strong>Delivery Mode:</strong> {order.deliveryMode}</p>
                                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                {order.location && (
                                    <p><strong>Delivery Location:</strong> Available</p>
                                )}
                                <p><strong>Total Items:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            </div>

                            <div className="order-actions">
                                <button 
                                    className="action-btn accept-order"
                                    onClick={() => handleAccept(order._id)}
                                >
                                     Accept Delivery
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AvailableOrders;