import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import busIcon from '../../assets/chefhat.png';
import custIcon from '../../assets/house.png';

// Fix for default markers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const RestaurantPickupMap = ({ address, restaurantName }) => {
  const [businessLocation, setBusinessLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Geocode restaurant address
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
        console.error("Geocoding error for address", address, error);
      }
      return null;
    };

    const fetchLocations = async () => {
      setIsLoading(true);
      const busLoc = await geocodeAddress(address);
      setBusinessLocation(busLoc);
      // Get customer location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCustomerLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Your Location'
            });
            setIsLoading(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setIsLoading(false);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
      } else {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [address]);

  const busMarker = new Icon({iconUrl: busIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]});
  const custMarker = new Icon({iconUrl: custIcon, iconSize: [32,32], iconAnchor:[16,32], popupAnchor: [0,-32]});

  // Center map between business and customer, or fallback
  const getMapCenter = () => {
    if (businessLocation && customerLocation) {
      return {
        lat: (businessLocation.lat + customerLocation.lat) / 2,
        lng: (businessLocation.lng + customerLocation.lng) / 2
      };
    }
    if (businessLocation) return { lat: businessLocation.lat, lng: businessLocation.lng };
    return { lat: 1.3521, lng: 103.8198 }; // Singapore default
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
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
                  <h4>{restaurantName || 'Restaurant'}</h4>
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
                  <h4>Your Location</h4>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default RestaurantPickupMap; 