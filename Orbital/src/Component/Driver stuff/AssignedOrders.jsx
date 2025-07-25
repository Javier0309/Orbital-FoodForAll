import { useEffect, useState } from "react";
import axios from 'axios'
import PhoneIcon from '../../assets/phone.png';
import MessageIcon from '../../assets/message.png';
import { useNavigate } from 'react-router-dom';

const AssignedOrders = ({driverId, onOrderSelect, setHasAssignedOrders}) => {
    //const driverId = localStorage.getItem("driverId"); 
    const [orders, setOrders] = useState([]);
    const [removedOrderIds, setRemovedOrderIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssigned = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/driver/assigned/${driverId}`)
            setOrders(res.data.orders)
            if (setHasAssignedOrders) setHasAssignedOrders(res.data.orders.length > 0);
            if (res.data.orders.length > 0 && onOrderSelect) onOrderSelect(res.data.orders[0]._id)
        };
        fetchAssigned();
    }, [driverId, onOrderSelect, setHasAssignedOrders]);

    const updateStatus = async (orderId, newStatus) => {
        await axios.post('http://localhost:4000/api/order/driver/update-status', {driverId, orderId, newStatus})
        alert(`Status updated to ${newStatus}`);
        window.location.reload();
    };

    // Remove order for driver (backend)
    const removeOrderForDriver = async (orderId) => {
        try {
            // If you have a backend endpoint for this, use it. Otherwise, fallback to local remove.
            await axios.patch(`http://localhost:4000/api/order/driver/remove/${orderId}`);
            setRemovedOrderIds(ids => [...ids, orderId]);
        } catch (error) {
            // fallback to local remove if backend not implemented
            setRemovedOrderIds(ids => [...ids, orderId]);
        }
    };

    return (
        <div className="orders" style={{margin: '0 auto', padding: '0 10px'}}>
            {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 0', color: '#37512f', fontWeight: 500, fontSize: 18}}>
                    No assigned orders<br/>
                    <span style={{fontWeight: 400, fontSize: 15}}>Orders will appear here once assigned</span>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                    {orders.filter(order => !order.removedByDriver && !removedOrderIds.includes(order._id)).map(order => (
                        <div key={order._id} className="order-card" style={{
                            background: 'rgb(208, 244, 196)',
                            color: '#37512f',
                            borderRadius: 12,
                            boxShadow: '0 2px 10px rgba(60,100,50,0.08)',
                            padding: 24,
                            marginBottom: 8,
                            opacity: order.status === 'rejected' || order.deliveryStatus === 'delivered' ? 0.85 : 1,
                            position: 'relative',
                        }}>
                            <p><strong>Order:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status === 'rejected' ? 'rejected' : order.deliveryStatus}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <div>
                                <strong>Items:</strong>
                                <ul style={{margin: 0, paddingLeft: 18}}>
                                    {order.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.name} - qty: {item.quantity}
                                            {item.comment && <p style={{margin: 0, fontSize: 13}}>Comments: {item.comment}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{display: 'flex', gap: 12, marginTop: 16}}>
                                {order.status === 'rejected' ? (
                                    <button
                                        style={{ background: '#991b1b', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}
                                        onClick={() => removeOrderForDriver(order._id)}
                                    >
                                        Remove
                                    </button>
                                ) : <>
                                    {order.deliveryStatus === 'assigned' && (
                                        <button 
                                            style={{background: '#467844', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer'}}
                                            onClick={() => updateStatus(order._id, 'in_transit')}
                                        >
                                            Start Delivery
                                        </button>
                                    )}
                                    {order.deliveryStatus === 'in_transit' && (
                                        <button 
                                            style={{background: '#467844', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer'}}
                                            onClick={() => updateStatus(order._id, 'delivered')}
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </>}
                            </div>
                            {/* Phone and message buttons to the right */}
                            <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, minHeight: 90 }}>
                                {order.customer && order.customer.phone && (
                                    <a
                                        href={`tel:${order.customer.phone}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            background: '#e9f5e1', // light background
                                            boxShadow: '0 1px 4px rgba(60,100,50,0.07)',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
                                        title={`Call Customer`}
                                    >
                                        <img src={PhoneIcon} alt="Call" style={{width: 26, height: 26, filter: 'invert(0.3)'}} />
                                    </a>
                                )}
                                <button
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        background: '#e9f5e1', // light background
                                        border: 'none', // remove border
                                        boxShadow: 'none', // remove shadow
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                    title={`Message Customer`}
                                    onClick={() => navigate(`/driver/message/${driverId}`)}
                                >
                                    <img src={MessageIcon} alt="Message" style={{width: 26, height: 26, filter: 'invert(0.3)'}} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


export default AssignedOrders;