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
    const [staticRoute, setStaticRoute] = useState([]);
    const [driverRoute, setDriverRoute] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState(null)
    const socketRef = useRef(null);
    const prevRouteRef = useRef({});

    useEffect(() => {
        // connect to socket for driver location
        socketRef.current = io("http://localhost:4000");

        // get order details & locations
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/order/${orderId}`);
                const data = await res.json();          // converts the raw http response to json, data will now be a JavaScript object 
                console.log('Order fetch response:', data);
                
                if (data.success) {
                    const order = data.order;
                    setOrder(order)
                    
                    
                    // get business location
                    if (order.businessId) {
                        const businessRes = await fetch(`http://localhost:4000/api/business/profile/${order.businessId}`)
                        const businessData = await businessRes.json();  
                        // converts the raw http response to json, businessData will now be a JavaScript object containing the business profile
                        console.log('Business profile response:', businessData);
                        if (businessData.success && businessData.business?.address){
                            const businessCoords = await geocodeAddress(businessData.business.address);
                            console.log('Business geocoded coords:', businessCoords);
                            if (businessCoords) {
                                setBusinessLocation({...businessCoords, address: businessData.business.address});
                            }
                        }
                    }
                    
                    // get customer location
                    if (order.customerEmail) {
                        const customerRes = await fetch(`http://localhost:4000/api/signup/customer-by-email/${order.customerEmail}`);
                        const customerData = await customerRes.json();
                        console.log('Customer profile response:', customerData);
                        if (customerData.success && customerData.customer?.address) {
                            const customerCoords = await geocodeAddress(customerData.customer.address);
                            console.log('Customer geocoded coords:', customerCoords);
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
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [orderId]);

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

    // when busLoc and custLoc loaded, get optimal route from busLoc to custLoc, set staticRoute
    useEffect(() => {
        if (businessLocation && customerLocation){
            setIsLoading(false)

            // React’s useEffect does not support async functions directly, because the callback should either return undefined / a cleanup function — not a Promise. Need to wrap in a async function
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

                {/* Defines the actual visual map tiles that everything else is drawn on. 
                    url: Uses OpenStreetMap tile server ({s} is subdomain, {z} zoom level, {x}/{y} are tile coordinates).
                    attribution: Legally required credit to OpenStreetMap for using their data. */}
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
            

                {/* Driver Route Path
                key: for the polyline to follow to draw the route
                     You're telling React: "Re-render this <Polyline> only when driverRoute.length changes." */}
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
