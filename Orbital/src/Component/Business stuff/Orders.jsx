import { useEffect, useState } from "react";
import axios from 'axios'
import { supabase } from "../../../backend/SupabaseClient";

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active')
    const [rejPopUp, setRejPopUp] = useState(false);
    const [rejectOrder, setRejectOrder] = useState(null);
    const [rejReason, setRejReason] = useState('')

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

    const updateStatus = async (orderId, newStatus, reason = undefined) => {
        try {
            await axios.patch(`http://localhost:4000/api/business/orders/${orderId}/status`,
                reason !== undefined ? {status: newStatus, reason} : {status: newStatus}
            )
            await fetchOrders();
        } catch (error) {
            console.error('Failed updating status', error)
        }
    }
    const removeOrder = async (orderId) => {
        try {
            await axios.patch(`http://localhost:4000/api/business/orders/${orderId}/remove`)
            await fetchOrders();
        } catch (error) {
            console.error('Failed to remove order', error);
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
    const pendingOrders = orders.filter(order => order.status === 'pending' && typeof order.businessId === 'string' && order.businessId === currentBusinessId);
    const completedOrders = orders.filter(order => {
      const businessId = order.businessId;
      return (
        (order.status === 'completed' || order.status === 'rejected' || order.status === 'ready' || order.deliveryStatus === 'delivered') &&
        typeof businessId === 'string' && businessId === currentBusinessId
      );
    });
    const acceptedOrders = completedOrders.filter(order => order.status !== 'rejected');
    const rejectedOrders = completedOrders.filter(order => order.status === 'rejected');
    return (
        <div className='orders'>
            {rejPopUp && rejectOrder && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: 'rgb(212, 212, 212)', borderRadius: '12px', padding: '32px', minWidth: '350px', maxWidth: '90vw', boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
                    }}>
                        <h2>Reason for rejecting order</h2>
                        <h3>{rejectOrder._id}</h3>
                        <p>Dietary requirements: {rejectOrder.dietaryRequirements || 'N/A'}</p>
                        <p>Allergies: {rejectOrder.allergies || 'N/A'}</p>
                        <div style={{ background: ' rgb(174, 212, 237)', color: 'black', padding: '20px', borderRadius: '8px', margin: '10px 0' }}>
                            <ul>
                                {rejectOrder.items.map(item => (
                                    <li key={item.foodId}>
                                        {item.name} - {item.quantity}
                                        <p>Comments: {item.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <textarea
                            placeholder="Type reason for rejection..."
                            value={rejReason}
                            onChange={e => setRejReason(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', padding: '8px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={async () => {
                                    await updateStatus(rejectOrder._id, 'rejected', rejReason);
                                    setRejPopUp(false);
                                    setRejectOrder(null);
                                    setRejReason('');
                                }}
                                style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setRejPopUp(false);
                                    setRejectOrder(null);
                                    setRejReason('');
                                }}
                                style={{
                                    backgroundColor: '#e2e8f0',
                                    color: 'black',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h2>Orders</h2> 
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
            {activeTab === 'active' ? (
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
                                    Mark as Ready
                                </button>
                                <button 
                                    onClick={() => {
                                        setRejectOrder(order);
                                        setRejPopUp(true);
                                        }}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )
            ) : (
                completedOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h3>No completed orders yet</h3>
                    </div>
                ) : (
                    <>
                    <h3 style={{marginBottom: '10px'}}>Completed Orders</h3>
                    {completedOrders.map(order => (
                        <div key={order._id} className="order-card" style={{opacity: 0.7, backgroundColor: getOrderColor(order), marginBottom: '16px'}}>
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
                            {order.status === 'rejected' && order.rejectionReason && (
                                <div style={{background: '#ef4444', color: 'white', padding: '10px', borderRadius: '6px', marginTop: '10px'}}>
                                    <strong>Rejection Reason:</strong>
                                    <p>{order.rejectionReason}</p>
                                </div>
                            )}
                            {(order.status === 'completed' || order.status === 'rejected') && (
                                <button onClick={() => removeOrder(order._id)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    </>
                )
            )}
        </div>
    )
}

export default Orders;
