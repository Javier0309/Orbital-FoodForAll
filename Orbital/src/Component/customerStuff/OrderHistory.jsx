import { useEffect, useState } from "react";
import axios from 'axios';
import CustHeader from "./CustHeader";
import { supabase } from '../../../backend/SupabaseClient';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            let email = localStorage.getItem('email');
            if (!email && supabase) {
                const session = await supabase.auth.getSession();
                email = session.data.session?.user?.email;
            }
            if (!email) {
                setOrders([]);
                setLoading(false);
                return;
            }
            const res = await axios.get(`http://localhost:4000/api/order/customer-history/${email}`);
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error('Fetch orders failed:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        // For rejected orders, always show them regardless of removedByCustomer status
        // For other orders, only show if not removed by customer
        (order.status === 'rejected' || !order.removedByCustomer) &&
        (order.status === 'completed' || order.status === 'rejected' || (order.deliveryMode === 'pickup' && order.deliveryStatus === 'delivered'))
    );

    if (loading) return (
        <>
            <CustHeader />
            <div>Loading orders...</div>
        </>
    );

    return (
        <>
            <CustHeader />
            <div className="orders" style={{margin: '0 auto', padding: '0 10px', minWidth: 900, maxWidth: 1100, marginTop: 32}}>
                <h2>Order History</h2>
                {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h3>No order history yet</h3>
                    </div>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '10px', color: '#37512f' }}>Past Orders</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                        {filteredOrders.map(order => (
                            <div key={order._id} className="order-card" style={{
                                background: 'rgb(244, 205, 196)',
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
                                <p style={{ color: order.status === 'rejected' ? 'red' : undefined }}><strong>Status:</strong> {order.status === 'completed' ? 'Completed' : order.status === 'rejected' ? 'Rejected' : (order.deliveryMode === 'pickup' && order.deliveryStatus === 'delivered') ? 'Collected (Self Pickup)' : order.status}</p>
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