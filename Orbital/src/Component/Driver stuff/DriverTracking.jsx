import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'
import OrderMap from "../Customer stuff/OrderMap";
import './DriverMain.css';

const DriverTracking = ({orderId}) => {
    const [location, setLocation] = useState(null);
    const socketRef = useRef(null);
    const watchIdRef = useRef(null)

    useEffect(() => {
        socketRef.current = io('http://localhost:4000')
        if (!navigator.geolocation){
            console.error("Geolocation is not supported by this browser")
            return
        }
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude })
                    const driverId = localStorage.getItem("driverId")
                    if (driverId && socketRef.current && orderId){
                        socketRef.current.emit('driverLocationUpdate', {driverId, orderId, latitude, longitude})
                    }
                },
                (error) => {console.error("Geolocation error:", error)},
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000}
            )
            watchIdRef.current = watchId;
            return () => {
                if (watchIdRef.current !== null)
                    navigator.geolocation.clearWatch(watchId); 
                if (socketRef.current)
                    socketRef.current.disconnect();
            }
        }
    }, [orderId])

    return (
        <div className="track-delivery-container" style={{minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 0 60px 0'}}>
            <div className="track-delivery-card" style={{background: 'none', borderRadius: 0, boxShadow: 'none', padding: 0, maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
                <h3 style={{color: '#37512f', fontWeight: 700, fontSize: '2rem', marginBottom: '18px'}}>Current Delivery Order</h3>
                <div style={{margin: '8px 0'}}>
                    <div className="track-map-wrapper">
                        <OrderMap orderId={orderId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverTracking;