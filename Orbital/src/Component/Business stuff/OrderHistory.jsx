import { useEffect, useState } from "react";
import axios from 'axios'
import BusHeader from "./BusHeader";

const OrderHistory = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);

    // Fetch orders for this business   
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


    if (loading) return <div>Loading orders...</div>
    if (!orders.length) return <div>No orders yet</div>

    const removedOrders = orders.filter(order => (order.status === 'completed' || order.deliveryStatus === 'delivered' || order.deliveryStatus === 'ready') && order.removedByBusiness);
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
                    removedOrders.map(order => (
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
                        </div>
                    ))
                )}
        </div>
        </>
    )
}

export default OrderHistory;
