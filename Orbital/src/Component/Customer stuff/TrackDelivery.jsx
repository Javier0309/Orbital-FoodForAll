import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import CustomerTrackDriver from "./CustomerTrackDriver";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css'

const TrackDelivery = () => {
    const { orderId } = useParams();
    //const [driverId, setDriverId] = useState(null)
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/${orderId}`)
            if (res.data.success) setOrder(res.data.order)
        }
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval)
    }, [orderId])

    if (!order) return <p>Loading order...</p>

    const { deliveryStatus, driverId, businessLocation, customerLocation} = order
    return (
        <div>
            <h2>Track Delivery</h2>
            {driverId && deliveryStatus === 'in_transit' && (
            <><CustomerTrackDriver driverId={driverId} businessLocation={businessLocation} customerLocation={customerLocation}/></> )}

            <p><strong>{deliveryStatus === 'pending' ? 'Finding a Rider' :
                        deliveryStatus === 'assigned' ? 'Found a Rider!' :
                        deliveryStatus === 'in_transit' ? 'Your Rider is on the way!' :
                        'Food arrived' }
            </strong></p>
        </div>
    )
}

export default TrackDelivery