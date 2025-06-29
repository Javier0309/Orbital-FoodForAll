import { useEffect,useState } from "react";
import axios from 'axios'

const AvailableOrders = () => {
    const driverId = localStorage.getItem("driverId"); 
    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        axios.post('http://localhost:4000/api/order/driver/available-orders')
        .then(res => setOrders(res.data.orders))
        .catch(err => console.error(err))
    }, [])

    const handleAccept = async (orderId) => {
        await axios.post('http://localhost:4000/api/order/driver/self-assign', {driverId, orderId})
        alert('Order accepted!');
        window.location.reload();
    }

    return (
        <div>
            <h3>Available Orders</h3>
            {orders.length === 0 ? <p>No available orders</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <strong>From:</strong> {order.businessId?.name} <br/>
                            <strong>Items:</strong> {order.items.map(i => i.name).join(', ')}<br/>
                            <button onClick={() => handleAccept(order._id)}>Accept Delivery</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
    
}

export default AvailableOrders;