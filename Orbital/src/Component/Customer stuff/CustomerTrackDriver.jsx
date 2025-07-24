import { useEffect,useState } from "react";
import 'leaflet/dist/leaflet.css'
import OrderMap from './OrderMap'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerTrackDriver = ({orderId}) => {

    const [orderDetails , setOrderDetails ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async() => {
            try {
                //const email = localStorage.getItem('email');
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`)
                const data = await res.json();
                if (data.success) setOrderDetails(data.order)
            } catch (error) {
                console.error("Error fetching order details:", error)
            }
        }

        fetchOrderDetails();
    }, [orderId])

    return (
        <div>
            <h3>Tracking your Order</h3>
            {orderDetails && orderDetails.status === 'rejected' ? (
                <div style={{marginTop: '32px', padding: '24px', background: '#fee2e2', borderRadius: '8px', color: '#b91c1c'}}>
                    <h4>Your order has been rejected by the restaurant:</h4>
                    <p style={{fontWeight: 'bold'}}>{orderDetails.rejectionReason || 'No reason provided.'}</p>
                    <button
                        style={{marginTop: '16px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                        onClick={async () => {
                            await axios.patch(`http://localhost:4000/api/order/customer/remove/${orderDetails._id}`);
                            navigate('/custmain');
                        }}
                    >
                        See Other Food
                    </button>
                </div>
            ) : orderDetails && (
                <>
                    <p>Order ID: {orderDetails._id}</p>
                    <p>{orderDetails.deliveryStatus === 'in_transit' ? 'Your order is on the way!' :
                        orderDetails.deliveryStatus === 'delivered' ? 'Your order has arrived' :
                        orderDetails.deliveryStatus === 'assigned' ? 'Found a rider!' :
                        'Looking for rider...'}</p>
                    <OrderMap orderId={orderId} />
                </>
            )}
        </div>
    )
}

export default CustomerTrackDriver;