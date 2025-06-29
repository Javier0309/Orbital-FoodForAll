import { useEffect } from "react";
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

const DriverTracking = ({driverId}) => {
    useEffect(() => {
        if (!driverId) {
            console.warn("No driverId provided to DriverTracking")
            return
        }

        // ensure browser supports geolocation
        if (!navigator.geolocation){
            console.error("Geolocation is not supported by this browser")
            return
        }

        // watch the driver's location
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Driver location:", latitude, longitude)
                
                // emit the location to backend via socket
                socket.emit('driverLocationUpdate', {driverId, latitude, longitude})

            },
            (error) => {console.error("Geolocation error:", error)},
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000}
        );

        return () => navigator.geolocation.clearWatch(watchId)
    }, [driverId])

    return <p>Tracking driver location...</p>
}

export default DriverTracking;