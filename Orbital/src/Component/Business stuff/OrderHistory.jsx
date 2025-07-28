import { useEffect, useState } from "react";
import axios from 'axios'
import BusHeader from "./BusHeader";

const OrderHistory = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('completed');
    
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
    const completedOrders = filteredOrders.filter(order => order.status === 'completed');
    const rejectedOrders = filteredOrders.filter(order => order.status === 'rejected');
    
    return (
        <>
        <BusHeader />
        <div className='order-history' style={{margin: '0 auto', padding: '0 10px', minWidth: 900, maxWidth: 1100, marginTop: 32}}>
            <h2>Order History</h2> 
            <div style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                <button 
                    onClick={() => setActiveTab('completed')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'completed' ? '#3b82f6' : '#e2e8f0',
                        color: activeTab === 'completed' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Completed
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
            {activeTab === 'completed' ? (
                completedOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>No completed orders yet</h3>
                    </div>
                ) : (
                    <>
                    <h3 style={{marginBottom: '10px'}}>Completed Orders</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                    {completedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{
                            background: 'rgb(174, 212, 237)',
                            color: '#1e293b',
                            borderRadius: 12,
                            padding: 24,
                            marginBottom: 8,
                            position: 'relative',
                        }}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Delivery Mode:</strong>{order.deliveryMode}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Dietary needs:</strong> {order.dietaryNeeds || 'N/A'}</p>
                            <div>
                                <strong>Items:</strong>
                                <ul style={{margin: 0, paddingLeft: 18}}>
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
                    </div>
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
                    <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                    {rejectedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{
                            background: 'rgb(174, 212, 237)',
                            color: '#1e293b',
                            borderRadius: 12,
                            boxShadow: '0 2px 10px rgba(235, 30, 112, 0.08)',
                            padding: 24,
                            marginBottom: 8,
                            position: 'relative',
                        }}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Delivery Mode:</strong>{order.deliveryMode}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Dietary needs:</strong> {order.dietaryNeeds || 'N/A'}</p>
                            <div>
                                <strong>Items:</strong>
                                <ul style={{margin: 0, paddingLeft: 18}}>
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
                    </div>
                    </>
                )
            )}
        </div>
        </>
    )
}

export default OrderHistory;
