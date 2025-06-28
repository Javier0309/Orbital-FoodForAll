import { useEffect,useState } from "react";
import io from 'socket.io-client'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CustHeader from "./CustHeader";

const socket = io("http://localhost:4000")

const CustomerTrackDriver = ({driverId, businessLocation, customerLocation}) => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (!driverId) return;
        const eventName = `location-${driverId}`;

        socket.on(eventName, (data) => {
            setPosition([data.latitude, data.longitude])
        })

        return () => socket.off(eventName)
    }, [driverId])

    console.log('businessLocation', businessLocation, 'customerLocation', customerLocation);


        if (!position || !businessLocation || !customerLocation){
            return <p>Tracking delivery...</p>
        }

        // the path thing!
        const path = [
            [businessLocation.latitude, businessLocation.longitude],
            position,
            [customerLocation.latitude, customerLocation.longitude]
        ]

    return (
        <div>
            <CustHeader/>
            
            <h3>Tracking your Delivery</h3>
                <MapContainer center={position} zoom={20} style={{ height: "300px", width: "100%"}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={position} title="Rider"/>
                    <Marker position={[businessLocation.latitude, businessLocation.longitude]} title="Restaurant"/>
                    <Marker position={[customerLocation.latitude, customerLocation.longitude]} title="You"/>
                    <Polyline positions={path} color="orange"/>
                </MapContainer>
        </div>
    )
}

export default CustomerTrackDriver;