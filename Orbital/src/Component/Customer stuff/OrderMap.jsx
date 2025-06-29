import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import marketShadow from 'leaflet/dist/images/marker-shadow.png'

import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';

// fix for default markers
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: marketShadow,
});

const OrderMap = ({ orderId }) => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [businessLocation, setBusinessLocation] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);
    const [routePath, setRoutePath] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // connect to socket for driver location
        socketRef.current = io("http://localhost:4000");

        // get order details & locations
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`);
                const data = await res.json();
                
                if (data.success) {
                    const order = data.order;
                    
                    
                    // get business location
                    if (order.businessId) {
                        const businessRes = await fetch(`http://localhost:4000/api/business/profile/${order.businessId}`)
                        const businessData = await businessRes.json();

                        if (businessData.success && businessData.business?.address){
                            const businessCoords = await geocodeAddress(businessData.business.address);
                            if (businessCoords) setBusinessLocation({...businessCoords, address: businessData.business.address});

                        }
                    }
                    
                    // get customer location
                    if (order.customerEmail) {
                        const customerRes = await fetch(`http://localhost:4000/api/signup/customer-by-email/${order.customerEmail}`);
                        const customerData = await customerRes.json();
                        if (customerData.success && customerData.customer?.address) {
                            const customerCoords = await geocodeAddress(customerData.customer.address);
                            setCustomerLocation({...customerCoords, address: customerData.customer.address});
                    }
                }
            }
            } catch (error) {
                console.error("Error fetching order details:", error);
            }
        };

        fetchOrderDetails();

        // listen for driver location updates
        socketRef.current.on(`location-${orderId}`, (location) => {
            setDriverLocation(location);
            updateRoutePath(location);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [orderId]);

    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    address: address
                };
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
        return null;
    };

    const updateRoutePath = (driverLoc) => {
        if (businessLocation && customerLocation && driverLoc) {
            // create the path thing 
            setRoutePath([
                [businessLocation.lat, businessLocation.lng],
                [driverLoc.latitude, driverLoc.longitude],
                [customerLocation.lat, customerLocation.lng]
            ]);
        }
    };

    // calculate center of map
    const getMapCenter = () => {
        if (businessLocation && customerLocation && driverLocation) {
            return {
                lat: (businessLocation.lat + customerLocation.lat + driverLocation.latitude) / 3,
                lng: (businessLocation.lng + customerLocation.lng + driverLocation.longitude) / 3
            };
        }
        if (businessLocation && customerLocation) {
        return {
            lat: (businessLocation.lat + customerLocation.lat) / 2,
            lng: (businessLocation.lng + customerLocation.lng) / 2
        };
        }
        return { lat: 1.3521, lng: 103.8198 }; // SG default
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <MapContainer 
                center={getMapCenter()} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Business Marker */}
                {businessLocation && (
                    <Marker position={[businessLocation.lat, businessLocation.lng]}>
                        <Popup>
                            <div>
                                <h4>Restaurant</h4>
                                <p>{businessLocation.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {/* Customer Marker */}
                {customerLocation && (
                    <Marker position={[customerLocation.lat, customerLocation.lng]}>
                        <Popup>
                            <div>
                                <h4>Delivery Address</h4>
                                <p>{customerLocation.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {/* Driver Marker */}
                {driverLocation && (
                    <Marker position={[driverLocation.latitude, driverLocation.longitude]}>
                        <Popup>
                            <div>
                                <h4>Driver</h4>
                                <p>Real-time location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                
                {/* Route Path */}
                {routePath.length > 0 && (
                    <Polyline positions={routePath} color="blue" weight={3} opacity={0.7}/>
                )}
            </MapContainer>
        </div>
    );
};

export default OrderMap;
