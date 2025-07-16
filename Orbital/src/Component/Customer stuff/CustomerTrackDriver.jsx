import { useEffect,useState } from "react";
import 'leaflet/dist/leaflet.css'
import OrderMap from './OrderMap'

const CustomerTrackDriver = ({orderId}) => {

    const [orderDetails , setOrderDetails ] = useState(null);

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
            
            <OrderMap orderId={orderId}/>

            {orderDetails && (
                <div>
                    <p>Order ID: {orderDetails._id}</p>
                    <p>{orderDetails.deliveryStatus === 'in_transit' ? 'Your order is on the way!' :
                        orderDetails.deliveryStatus === 'delivered' ? 'Your order has arrived' :
                        orderDetails.deliveryStatus === 'assigned' ? 'Found a rider!' :
                        'Looking for rider...'}</p>
                </div>
            )}
        </div>
    )
}

export default CustomerTrackDriver;