import { useEffect,useState } from "react";
import io from 'socket.io-client'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const socket = io("http://localhost:4000")

const CustomerTrackDriver = ({driverId}) => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (!driverId) return;
        const eventName = `location-${driverId}`;

        socket.on(eventName, (data) => {
            setPosition([data.latitude, data.longitude])
        })

        return () => socket.off(eventName)
    }, [driverId])

    return (
        <div>
            <h3>Tracking your Delivery</h3>
            {position ? (
                <MapContainer center={position} zoom={15} style={{ height: "300px", width: "100%"}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={position}/>
                </MapContainer>
            ) : (
                <p>Waiting for driver location...</p>
            )}
        </div>
    )
}

export default CustomerTrackDriver;