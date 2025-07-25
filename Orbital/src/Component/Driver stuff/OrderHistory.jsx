import { useEffect, useState } from "react";
import axios from 'axios';
import DriverHeader from "./DriverHeader";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const driverId = localStorage.getItem('driverId');
            const res = await axios.get(`http://localhost:4000/api/order/driver/delivered/${driverId}`);
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error('Fetch orders failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderColor = (order) => {
        // Use the same color as AssignedOrders for delivered
        return 'rgb(172, 209, 150)';
    };

    if (loading) return (
        <>
            <DriverHeader />
            <div>Loading orders...</div>
        </>
    );

    // Only show completed orders
    const deliveredOrders = orders.filter(order => order.status === 'completed');

    return (
        <>
            <DriverHeader />
            <div className="orders" style={{margin: '0 auto', padding: '0 10px', minWidth: 900, maxWidth: 1100, marginTop: 32}}>
                <h2>Order History</h2>
                {deliveredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h3>No delivered orders yet</h3>
                    </div>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '10px', color: '#37512f' }}>Delivered Orders ({deliveredOrders.length})</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                        {deliveredOrders.map(order => (
                            <div key={order._id} className="order-card" style={{
                                background: 'rgb(208, 244, 196)',
                                color: '#37512f',
                                borderRadius: 12,
                                boxShadow: '0 2px 10px rgba(60,100,50,0.08)',
                                padding: 24,
                                marginBottom: 8,
                                position: 'relative',
                            }}>
                                <p><strong>Order:</strong> {order._id}</p>
                                {order.businessId && (
                                    <>
                                        <p><strong>Business:</strong> {order.businessId.name}</p>
                                        <p style={{margin: 0, color: '#6b7280', fontSize: '0.95em'}}><strong>Location:</strong> {order.businessId.address}</p>
                                    </>
                                )}
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                <div>
                                    <strong>Items:</strong>
                                    <ul style={{margin: 0, paddingLeft: 18}}>
                                        {order.items.map((item, idx) => (
                                            <li key={item.foodId || idx}>
                                                {item.name} - qty: {item.quantity}
                                                {item.comment && <p style={{margin: 0, fontSize: 13}}>Comments: {item.comment}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default OrderHistory;
