import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import marketShadow from 'leaflet/dist/images/marker-shadow.png'

import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import polyline from "@mapbox/polyline";

import busIcon from '../../assets/chefhat.png'
import driverIcon from '../../assets/motorbike.png'
import custIcon from '../../assets/house.png'


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
    const [staticRoute, setStaticRoute] = useState([]);
    const [driverRoute, setDriverRoute] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null)
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
                    setOrder(order)
                    
                    
                    // get business location
                    if (order.businessId) {
                        const businessRes = await fetch(`http://localhost:4000/api/business/profile/${order.businessId}`)
                        const businessData = await businessRes.json();

                        if (businessData.success && businessData.business?.address){
                            const businessCoords = await geocodeAddress(businessData.business.address);
                            if (businessCoords) {
                                setBusinessLocation({...businessCoords, address: businessData.business.address});
                            }
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
            getDriverRoute(location);
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

    const getStaticRoute = async () => {
        if (businessLocation && customerLocation) {
            const route = await getOptimalRoute(businessLocation, customerLocation)
            if (route) {
                setStaticRoute(route);
            } else {
                setStaticRoute([
                    [businessLocation.lat, businessLocation.lng],
                    [customerLocation.lat, customerLocation.lng]
                ])
            }
        }
    }

    // gives the road
    const getOptimalRoute = async (start, end) => {
        try {
            const apiKey = '5b3ce3597851110001cf6248f9e27ef6749b48e181a13eebf7d7d716'

            const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({coordinates: [[start.lng, start.lat], [end.lng, end.lat]], format: 'geojson'
                })
            })
            

            const data = await response.json();

            if (data.routes && data.routes[0] && data.routes[0].geometry) {
                const route = data.routes[0];
                // decode the polyline to get coords
                if ( typeof route.geometry === 'string') {
                    const coordinates = polyline.decode(route.geometry)
                    return coordinates.map(coord => [coord[0], coord[1]])
                }
            }

            
        } catch (error) {
            console.error('Error getting optimal route:', error)
        }
        return null;
    }

    const getDriverRoute = async (driverLoc) => {
        if (driverLoc && businessLocation && customerLocation){
            if (order?.deliveryStatus === 'assigned' || order?.deliveryStatus === 'pending'){
            // get route from driver to business
            const route1 = await getOptimalRoute(
                {lat: driverLoc.latitude, lng: driverLoc.longitude},
                businessLocation
            )
            
            if (route1 && staticRoute.length > 0) setDriverRoute([...route1, ...staticRoute])
        } else if (order?.deliveryStatus === 'in_transit') {
            const route2 = await getOptimalRoute({lat: driverLoc.latitude, lng: driverLoc.longitude},
                customerLocation)

                if (route2) setDriverRoute(route2)
        }

            //if (route1 && route2) setDriverRoute([...route1, ...route2])
        }
    }

    // calculate center of map
    const getMapCenter = () => {
        if (businessLocation && customerLocation && driverLocation) {
            const center = {
                lat: (businessLocation.lat + customerLocation.lat + driverLocation.latitude) / 3,
                lng: (businessLocation.lng + customerLocation.lng + driverLocation.longitude) / 3
            };
            return center;
        }
        if (businessLocation && customerLocation) {
            const center = {
                lat: (businessLocation.lat + customerLocation.lat) / 2,
                lng: (businessLocation.lng + customerLocation.lng) / 2
            };
            return center;
        }
        return { lat: 1.3521, lng: 103.8198 }; // SG default
    };

    useEffect(() => {
        if (businessLocation && customerLocation){
            setIsLoading(false)
            getStaticRoute();
        } 
    }, [businessLocation, customerLocation])

    const busMarker = new Icon({iconUrl: busIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})
    const driverMarker = new Icon({iconUrl: driverIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})
    const custMarker = new Icon({iconUrl: custIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})


    return (
        <div style={{ height: '400px', width: '100%' }}>
            {isLoading ? (
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Loading map...
                </div>
            ) : (
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
                    <Marker position={[businessLocation.lat, businessLocation.lng]} icon={busMarker}>
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
                    <Marker position={[customerLocation.lat, customerLocation.lng]} icon={custMarker}>
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
                    <Marker position={[driverLocation.latitude, driverLocation.longitude]} icon={driverMarker}>
                        <Popup>
                            <div>
                                <h4>Driver</h4>
                                <p>Real-time location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            

                {/* Driver Route Path */}
                {driverRoute.length > 0 && (
                    <Polyline key={`driver-route-${driverRoute.length}`} positions={driverRoute} color="red" weight={10} opacity={1}/>
                )}

                {/* Static Route (business to customer) */}
                {staticRoute.length > 0 && (
                    <Polyline key={`static-route-${staticRoute.length}`}positions={staticRoute} color="orange" weight={10} opacity={1}/>
                )}
            </MapContainer>
            )}
        </div>
    );
};

export default OrderMap;
