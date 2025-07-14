import { useEffect, useState } from "react";
import axios from 'axios'

const AssignedOrders = ({driverId, onOrderSelect}) => {
    //const driverId = localStorage.getItem("driverId"); 
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchAssigned = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/driver/assigned/${driverId}`)
            setOrders(res.data.orders)

            if (res.data.orders.length > 0 && onOrderSelect) onOrderSelect(res.data.orders[0]._id)
        };
        fetchAssigned();
    }, [driverId, onOrderSelect]);

    const updateStatus = async (orderId, newStatus) => {
        await axios.post('http://localhost:4000/api/order/driver/update-status', {driverId, orderId, newStatus})
        alert(`Status updated to ${newStatus}`);
        window.location.reload();
    };

    return (
        <div className="assigned-orders">
            <div className="orders-header">
                <h3 className="orders-title">�� Assigned Orders</h3>
                <span className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>
            
            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No assigned orders</p>
                    <span>Orders will appear here once assigned</span>
                </div>
            ) : (
                <div className="orders-grid">
                    {orders.map(order => (
                        <div key={order._id} className="order-card assigned">
                            <div className="order-header">
                                <span className="order-id">#{order._id.slice(-8)}</span>
                                <div className={`status-badge ${order.deliveryStatus}`}>
                                    {order.deliveryStatus}
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
                                            <span className="item-qty">x{item.quantity}</span>
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
                            </div>

                            <div className="order-actions">
                                {order.deliveryStatus === 'assigned' && (
                                    <button 
                                        className="action-btn start-delivery"
                                        onClick={() => updateStatus(order._id, 'in_transit')}
                                    >
                                        🚚 Start Delivery
                                    </button>
                                )}
                                {order.deliveryStatus === 'in_transit' && (
                                    <button 
                                        className="action-btn mark-delivered"
                                        onClick={() => updateStatus(order._id, 'delivered')}
                                    >
                                        ✅ Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


export default AssignedOrders;