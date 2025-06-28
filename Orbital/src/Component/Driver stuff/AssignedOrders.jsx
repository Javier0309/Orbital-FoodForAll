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
        <div>
            <h3>Assigned Orders</h3>
            {orders.length === 0 ? <p>No assigned orders</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <strong>Items:</strong> {order.items.map(i => i.name).join(', ')} <br/>
                            <strong>Status:</strong> {order.deliveryStatus} <br/>
                            {order.deliveryStatus === 'assigned' && (
                                <button onClick={()=> updateStatus(order._id, 'in_transit')}>Start Delivery</button>
                            )}
                            {order.deliveryStatus === 'in_transit' && (
                            <button onClick={()=> updateStatus(order._id, 'delivered')}>Mark as Delivered</button>
                            )}
                        </li>
                        ))}
                </ul>
            )}
        </div>
    )
}

export default AssignedOrders;