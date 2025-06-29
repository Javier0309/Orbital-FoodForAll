import { useEffect, useState } from "react";
import axios from 'axios'
import { supabase } from "../../../backend/SupabaseClient";

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);

    const getNextStatuses = (mode) => {
        if (mode === 'delivery') return ['pending', 'ready', 'assigned', 'in_transit', 'delivered', 'completed']
        return ['pending', 'ready', 'collected', 'completed']
    }

    // Fetch orders for this business   
    useEffect (() => {
        async function fetchOrders() {
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
        fetchOrders()
    }, [])


    // Helper to change order status
    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/api/business/orders/${orderId}/status`,
                { status: newStatus}
            )
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus} : o))
        } catch (error) {
            console.error('Failed updating status', error)
        }
    }

    if (loading) return <div>Loading orders...</div>
    if (!orders.length) return <div>No orders yet</div>

    return (
        <div className='orders'>
            <h2>Orders</h2> 
            {orders.map(order => (
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
                        {getNextStatuses(order.deliveryMode).map(status => (
                            <button key={status} disabled={order.status === status}
                            onClick={() => updateStatus(order._id, status)}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                            
                    </div>
                </div>

            ))}
        </div>
    )
}

export default Orders;