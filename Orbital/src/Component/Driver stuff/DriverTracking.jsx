import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'
import OrderMap from "../Customer stuff/OrderMap";


const DriverTracking = ({orderId}) => {
    const [location, setLocation] = useState(null);
    const socketRef = useRef(null);
    const watchIdRef = useRef(null)

    useEffect(() => {

        //connect to socket once on mount
        socketRef.current = io('http://localhost:4000')

        // ensure browser supports geolocation
        if (!navigator.geolocation){
            console.error("Geolocation is not supported by this browser")
            return
        }

            // watch the driver's location
            if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Driver location:", latitude, longitude);
                setLocation({ latitude, longitude })

                const driverId = localStorage.getItem("driverId")
                if (driverId && socketRef.current && orderId){
                    // emit the location to backend via socket
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
    }, [orderId])  // empty array so that it only runs once

    return (
        <>
        <p>Tracking driver location...</p>
        {orderId && <OrderMap orderId={orderId}/>}
        </>
    )
}

export default DriverTracking;