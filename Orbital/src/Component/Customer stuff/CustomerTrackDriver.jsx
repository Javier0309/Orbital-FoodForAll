import { useEffect,useState,useRef } from "react";
import io from 'socket.io-client'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import OrderMap from './OrderMap'

const socket = io("http://localhost:4000")

const CustomerTrackDriver = ({orderId}) => {

    //const [position, setPosition] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [orderDetails , setOrderDetails ] = useState(null);
    const socketRef = useRef(null);

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

        // connect to socket for driver location
        socketRef.current = io("http://localhost:4000")

        socketRef.current.on(`location-${orderId}`, (location) => {
            setDriverLocation(location)
        })

        return () => {if (socketRef.current) socketRef.current.disconnect()}
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