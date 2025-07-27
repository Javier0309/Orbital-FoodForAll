import { useEffect, useState } from "react";
import axios from 'axios'
import BusHeader from "./BusHeader";

const OrderHistory = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('accepted');
    
    useEffect (() => {
            fetchOrders();
            }, [])

    const fetchOrders = async() => {
            try {
                const businessId = localStorage.getItem('businessId');
                const res = await axios.get(`http://localhost:4000/api/business/orders/${businessId}`)
                setOrders(res.data.orders);
            } catch (error) {
                console.error('Fetch orders failed:', error)
            } finally {
                setLoading(false);
            }
    }

    const getOrderColor = (order) => {
        if (order.status === 'rejected') return '#ef4444';
        if (order.status === 'ready' || order.status === 'completed' || order.deliveryStatus === 'delivered') return '#10b981';
        return 'rgb(174, 212, 237)';
    }

    if (loading) return <div>Loading orders...</div>
    if (!orders.length) return <div>No orders yet</div>

    const currentBusinessId = localStorage.getItem('businessId');
    const filteredOrders = orders.filter(order => typeof order.businessId === 'string' && order.businessId === currentBusinessId);
    const removedOrders = filteredOrders.filter(order => (order.status === 'completed' || order.status === 'rejected' || order.deliveryStatus === 'delivered' || order.deliveryStatus === 'ready') && order.removedByBusiness);
    const acceptedOrders = removedOrders.filter(order => (order.status === 'completed' || order.deliveryStatus === 'delivered' || order.deliveryStatus === 'ready'))
    const rejectedOrders = removedOrders.filter(order => order.status === 'rejected')
    
    return (
        <>
        <BusHeader />
        <div className='order-history'>
            <h2>Order History</h2> 
            {removedOrders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px'}}>
                    <h3>No order history</h3>
                </div>
            ) : (
            <>
            <div style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                <button 
                    onClick={() => setActiveTab('accepted')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'accepted' ? '#3b82f6' : '#e2e8f0',
                        color: activeTab === 'accepted' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Accepted
                </button>
                <button 
                    onClick={() => setActiveTab('rejected')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'rejected' ? '#3b82f6' : '#e2e8f0',
                        color: activeTab === 'rejected' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Rejected
                </button>
            </div>
            {activeTab === 'accepted' ? (
                acceptedOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>No accepted order history</h3>
                    </div>
                ) : (
                    <>
                    <h3 style={{marginBottom: '10px'}}>Accepted Orders</h3>
                    {acceptedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{backgroundColor: getOrderColor(order), marginBottom: '16px'}}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Delivery Mode:</strong>{order.deliveryMode}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <div>
                                <strong>Items:</strong>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.foodId}>
                                            {item.name} - qty: {item.quantity} 
                                            <p>Comments: {item.comment} </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    </>
                )
            ) : (
                rejectedOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>No rejected orders yet</h3>
                    </div>
                ) : (
                    <>
                    <h3 style={{marginBottom: '10px'}}>Rejected Orders</h3>
                    {rejectedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{backgroundColor: getOrderColor(order), marginBottom: '16px'}}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Delivery Mode:</strong>{order.deliveryMode}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <div>
                                <strong>Items:</strong>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.foodId}>
                                            {item.name} - qty: {item.quantity} 
                                            <p>Comments: {item.comment} </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {order.rejectionReason && (
                                <div style={{background: '#ef4444', color: 'white', padding: '10px', borderRadius: '6px', marginTop: '10px'}}>
                                    <strong>Rejection Reason:</strong>
                                    <p>{order.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    </>
                )
            )}
            </>
                )}
            </div>
        </>
    )
}

export default OrderHistory;
