import { useEffect, useState } from "react";
import axios from 'axios'
import { supabase } from "../../../backend/SupabaseClient";

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active')



    // Fetch orders for this business   
    useEffect (() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval)
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

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/api/business/orders/${orderId}/status`,
                {status:newStatus}
            )
            await fetchOrders();
            //setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus} : o))
        } catch (error) {
            console.error('Failed updating status', error)
        }
    }
    const removeOrder = async (orderId) => {
        try {
            await axios.patch(`http://localhost:4000/api/business/orders/${orderId}/remove`)
            await fetchOrders();    // refresh list after deleting
        } catch (error) {
            console.error('Failed to remove order', error);
        }
    }

    if (loading) return <div>Loading orders...</div>
    if (!orders.length) return <div>No orders yet</div>
    // filter orders based on tab
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const completedOrders = orders.filter(order => (order.status === 'completed' || order.deliveryStatus === 'delivered' || order.deliveryStatus === 'ready') && !order.removedByBusiness);
    return (
        <div className='orders'>
            <h2>Orders</h2> 
            
            {/* Add tab buttons */}
            <div style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                <button 
                    onClick={() => setActiveTab('active')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'active' ? '#3b82f6' : '#e2e8f0',
                        color: activeTab === 'active' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    To Prepare ({pendingOrders.length})
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'history' ? '#3b82f6' : '#e2e8f0',
                        color: activeTab === 'history' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Completed ({completedOrders.length})
                </button>
            </div>

            {/* Show orders based on active tab */}
            {activeTab === 'active' ? (
                // Show only pending orders
                pendingOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>All caught up!</h3>
                        <p>No orders to prepare</p>
                    </div>
                ) : (
                    pendingOrders.map(order => (
                        <div key={order._id} className="order-card">
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

                            <div className="actions">
                                {/* Only show "Mark as Ready" button */}
                                <button 
                                    onClick={() => updateStatus(order._id, 'ready')}
                                    style={{
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✅ Mark as Ready
                                </button>
                            </div>
                        </div>
                    ))
                )
            ) : (
                // Show completed orders
                completedOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>No completed orders yet</h3>
                    </div>
                ) : (
                    completedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{opacity: 0.7}}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status === 'completed' ? 'completed' : 'delivered'}</p>
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
                            {order.status === 'completed' && (
                                <button onClick={() => removeOrder(order._id)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))
                )
            )}
        </div>
    )
}

export default Orders;
