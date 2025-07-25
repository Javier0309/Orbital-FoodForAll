import { useEffect,useState } from "react";
import axios from 'axios'
import './DriverMain.css'

const AvailableOrders = () => {
    const driverId = localStorage.getItem("driverId"); 
    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const fetchOrders = () => {
            axios.post('http://localhost:4000/api/order/driver/available-orders')
                .then(res => setOrders(res.data.orders))
                .catch(err => console.error(err));
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
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
        <div className="orders" style={{margin: '40px auto', padding: '0 10px'}}>
            {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px 0', color: '#37512f', fontWeight: 500, fontSize: 18}}>
                    No available orders<br/>
                    <span style={{fontWeight: 400, fontSize: 15}}>New orders will appear here</span>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                    {orders.map(order => (
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
                            <p><strong>Status:</strong> pending</p>
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
                            <button 
                                style={{background: '#467844', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 'bold', fontSize: 15, marginTop: 16, cursor: 'pointer'}}
                                onClick={() => handleAccept(order._id)}
                            >
                                Accept Delivery
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AvailableOrders;