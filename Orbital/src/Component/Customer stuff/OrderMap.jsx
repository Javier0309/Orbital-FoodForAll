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

const OrderMap = ({ orderId, pickupMode }) => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [businessLocation, setBusinessLocation] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);
    const [staticRoute, setStaticRoute] = useState([]);
    const [driverRoute, setDriverRoute] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null)
    const socketRef = useRef(null);
    const prevRouteRef = useRef({});

    // For pickup mode: track real-time customer location
    useEffect(() => {
        let watchId;
        if (pickupMode) {
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        setCustomerLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            address: 'Your Location'
                        });
                    },
                    (error) => { console.error('Geolocation error:', error); },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                );
            }
        }
        return () => {
            if (pickupMode && watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [pickupMode]);

    useEffect(() => {
        // connect to socket for driver location (only if not pickupMode)
        if (!pickupMode) {
            socketRef.current = io("http://localhost:4000");
        }

        // get order details & locations
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`);
                const data = await res.json();
                if (data.success) {
                    const order = data.order;
                    setOrder(order)
                    // get business location
                    let businessId = order.businessId;
                    if (typeof businessId === 'object' && businessId._id) {
                        businessId = businessId._id;
                    }
                    if (businessId) {
                        const businessRes = await fetch(`http://localhost:4000/api/business/profile/${businessId}`)
                        const businessData = await businessRes.json();
                        if (businessData.success && businessData.business?.address){
                            const businessCoords = await geocodeAddress(businessData.business.address);
                            if (businessCoords) {
                                setBusinessLocation({...businessCoords, address: businessData.business.address});
                            }
                        }
                    }
                    // get customer location (for delivery mode only)
                    if (!pickupMode && order.customerEmail) {
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

        // listen for driver location updates (only if not pickupMode)
        if (!pickupMode && socketRef.current) {
            socketRef.current.on(`location-${orderId}`, (location) => {
                setDriverLocation(location);
            });
        }

        return () => {
            if (!pickupMode && socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [orderId, pickupMode]);

    // address --> coordinates
    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
            const data = await response.json();
            console.log('Geocoding response for', address, ':', data);
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    address: address
                };
            }
        } catch (error) {
            console.error("Geocoding error for address", address, error);
        }
        return null;
    };


    // gives the road
    const getOptimalRoute = async (start, end) => {
        try {
            const apiKey = import.meta.env.VITE_OPENROUTESERVICE_KEY

            const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    coordinates: [[start.lng, start.lat], [end.lng, end.lat]], 
                    format: 'geojson'
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

    // calculate center of map
    const getMapCenter = () => {
        if (businessLocation && customerLocation) {
            const center = {
                lat: (businessLocation.lat + customerLocation.lat) / 2,
                lng: (businessLocation.lng + customerLocation.lng) / 2
            };
            return center;
        }
        if (businessLocation) return { lat: businessLocation.lat, lng: businessLocation.lng };
        return { lat: 1.3521, lng: 103.8198 }; // SG default
    };

    // when busLoc and custLoc loaded, get optimal route from busLoc to custLoc, set staticRoute
    useEffect(() => {
        if (businessLocation && customerLocation){
            setIsLoading(false)
            const fetchStaticRoute = async () => {
                const route = await getOptimalRoute(businessLocation, customerLocation)
                if (route) {
                    setStaticRoute(route);
                }
            }
            fetchStaticRoute();
        } 
    }, [businessLocation, customerLocation])

    useEffect(() => {
        if (!driverLocation || !order) return;

        const fetchDriverRoute = async () => {
            const prev = prevRouteRef.current;
        
            if (order.deliveryStatus === 'in_transit' && customerLocation) {
                // to avoid unnecessary API calls too many times, only fetch if driver location or customer location has changed
                const unchanged =
                    prev.status === 'in_transit' &&
                    prev.driverLat === driverLocation.latitude &&
                    prev.driverLng === driverLocation.longitude &&
                    prev.custLat === customerLocation.lat &&
                    prev.custLng === customerLocation.lng

                if (unchanged) return; // No change, skip API call

                prevRouteRef.current = {
                    status: 'in_transit',
                    driverLat: driverLocation.latitude,
                    driverLng: driverLocation.longitude,
                    custLat: customerLocation.lat,
                    custLng: customerLocation.lng,
                };
                
                const route2 = await getOptimalRoute(
                    { lat: driverLocation.latitude, lng: driverLocation.longitude },
                    customerLocation      // (start,end)
                );

                if (route2) setDriverRoute(route2);

            } else if (
                (order.deliveryStatus === 'assigned' || order.deliveryStatus === 'pending') &&
                businessLocation && staticRoute.length > 0
            ) {
                // to avoid unnecessary API calls too many times, only fetch if driver location or business location has changed
                const unchanged =
                    prev.status === order.deliveryStatus &&
                    prev.driverLat === driverLocation.latitude &&
                    prev.driverLng === driverLocation.longitude &&
                    prev.busLat === businessLocation.lat &&
                    prev.busLng === businessLocation.lng &&
                    prev.staticRouteLen === staticRoute.length;

                if (unchanged) return; // No change, skip API call

                prevRouteRef.current = {
                    status: order.deliveryStatus,
                    driverLat: driverLocation.latitude,
                    driverLng: driverLocation.longitude,
                    busLat: businessLocation.lat,
                    busLng: businessLocation.lng,
                    staticRouteLen: staticRoute.length,
                };

                const route1 = await getOptimalRoute(
                    { lat: driverLocation.latitude, lng: driverLocation.longitude },
                    businessLocation
                );

                if (route1) setDriverRoute([...route1, ...staticRoute])
            }
        }
        fetchDriverRoute();
    }, [driverLocation, customerLocation, businessLocation, staticRoute, order]);

    const busMarker = new Icon({iconUrl: busIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})
    const driverMarker = new Icon({iconUrl: driverIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})
    const custMarker = new Icon({iconUrl: custIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]})

    if (driverRoute.length > 0) {
        console.log('Rendering driverRoute Polyline', driverRoute);
    }

    // For pickupMode, do not show driver marker or driverRoute
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
                {/* Customer Marker (real-time for pickup) */}
                {customerLocation && (
                    <Marker position={[customerLocation.lat, customerLocation.lng]} icon={custMarker}>
                        <Popup>
                            <div>
                                <h4>{pickupMode ? 'Your Location' : 'Delivery Address'}</h4>
                                <p>{customerLocation.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                {/* Static Route (business to customer) */}
                {staticRoute.length > 0 && (
                    <Polyline key={`static-route-${staticRoute.length}`}positions={staticRoute} color="orange" weight={10} opacity={1}/>
                )}
                {/* Only show driver marker/route if not pickupMode */}
                {!pickupMode && driverLocation && (
                    <Marker position={[driverLocation.latitude, driverLocation.longitude]} icon={driverMarker}>
                        <Popup>
                            <div>
                                <h4>Driver</h4>
                                <p>Real-time location</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
                {!pickupMode && driverRoute.length > 0 && (
                    <Polyline key={`driver-route-${driverRoute.length}`} positions={driverRoute} color="red" weight={10} opacity={1}/>
                )}
            </MapContainer>
            )}
        </div>
    );
};

export default OrderMap;
