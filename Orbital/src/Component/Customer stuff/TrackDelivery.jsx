import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import CustomerTrackDriver from "./CustomerTrackDriver";
import CustHeader from "./CustHeader";
import DriverCard from "./DriverCard";

const TrackDelivery = () => {
    const { orderId } = useParams();
    const [driverId, setDriverId] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await axios.get(`http://localhost:4000/api/order/${orderId}`)
            if (res.data.success) setDriverId(res.data.order.driverId)
        }
    fetchOrder();
    }, [orderId])

    if (!driverId) return <p>Waiting for a driver...</p>

    return (
        <div>
            <CustHeader/>
            <h2>Track Delivery</h2>
            <CustomerTrackDriver orderId={orderId}/>
            <DriverCard driverId={driverId}/>
        </div>
    )
}

export default TrackDelivery