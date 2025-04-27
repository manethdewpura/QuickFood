import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socket from '../../utils/socket'; // Adjust the import path as necessary

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (iconUrl, iconSize) => {
  return L.icon({
    iconUrl,
    iconSize: iconSize || [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Helper function to safely extract coordinates from location objects
const getCoordinates = (location) => {
  if (!location || !location.coordinates) return null;
  const { lat, lng } = location.coordinates;
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
};


// Component to update map center when location changes
const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

// Component to capture map instance and fix rendering
const MapReference = () => {
  const map = useMap();
  const { current: mapInstance } = useRef(map);

  useEffect(() => {
    if (mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    }
  }, [mapInstance]);

  return null;
};

// Component to draw route between points
const RouteLayer = ({ pickupCoords, deliveryCoords, currentCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!pickupCoords || !deliveryCoords || !currentCoords) return;

    // Clear previous routes
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Create route from current location to pickup
    const routeToPickup = L.polyline([
      currentCoords,
      pickupCoords
    ], { color: 'blue', dashArray: '5, 10' });

    // Create route from pickup to delivery
    const routeToDelivery = L.polyline([
      pickupCoords,
      deliveryCoords
    ], { color: 'blue', dashArray: '5, 10' });

    routeToPickup.addTo(map);
    routeToDelivery.addTo(map);

    // Fit bounds to show entire route
    const bounds = L.latLngBounds([
      currentCoords,
      pickupCoords,
      deliveryCoords
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [map, pickupCoords, deliveryCoords, currentCoords]);

  return null;
};

const DeliveryMap = ({ deliveryId, pickupLocation, deliveryLocation, initialCurrentLocation }) => {
  const [currentLocation, setCurrentLocation] = useState(initialCurrentLocation);
  const mapRef = useRef(null);  // Add this line to create a ref


  // Icons for different markers
  const driverIcon = createCustomIcon('https://cdn-icons-png.flaticon.com/512/3448/3448636.png', [32, 32], {
    zIndexOffset: 1000  // This will raise the driver icon above others
  });
  
    const restaurantIcon = createCustomIcon('https://cdn-icons-png.flaticon.com/512/562/562678.png', [32, 32]);
  const customerIcon = createCustomIcon('https://cdn-icons-png.flaticon.com/512/1077/1077063.png', [32, 32]);

  // Extract coordinates from location objects
  const currentCoords = getCoordinates(currentLocation);
  const pickupCoords = getCoordinates(pickupLocation);
  const deliveryCoords = getCoordinates(deliveryLocation);

  useEffect(() => {
    // Join the delivery tracking room when component mounts
    if (deliveryId) {
      socket.emit('joinDeliveryRoom', deliveryId);

      // Listen for location updates
      socket.on('locationUpdate', (data) => {
        if (data.deliveryId === deliveryId) {
          console.log('Received location update:', data.currentLocation);
          setCurrentLocation(data.currentLocation);
        }
      });

      // Cleanup function
      return () => {
        socket.off('locationUpdate');
        socket.emit('leaveDeliveryRoom', deliveryId);
      };
    }
  }, [deliveryId]);

  // Don't render the map until we have valid coordinates
  if (!currentCoords || !pickupCoords || !deliveryCoords) {
    console.log('Missing coordinates:', { currentLocation, pickupLocation, deliveryLocation });
    return <div>Loading map data...</div>;
  }

  return (
    <div className="delivery-map">
      <h2>Live Tracking</h2>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={currentCoords}
          zoom={10}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Driver marker */}
          <Marker
            position={currentCoords}
            icon={driverIcon}
          >
            <Popup>Driver Location</Popup>
          </Marker>

          {/* Restaurant marker */}
          <Marker
            position={pickupCoords}
            icon={restaurantIcon}
          >
            <Popup>Restaurant Location</Popup>
          </Marker>

          {/* Delivery location marker */}
          <Marker
            position={deliveryCoords}
            icon={customerIcon}
          >
            <Popup>Delivery Location</Popup>
          </Marker>

          {/* Update map center when driver location changes */}
          <MapUpdater center={currentCoords} />

          {/* Draw route between points */}
          <RouteLayer
            pickupCoords={pickupCoords}
            deliveryCoords={deliveryCoords}
            currentCoords={currentCoords}
          />

          {/* Add this line to fix map rendering */}
          <MapReference />
        </MapContainer>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'blue' }}></div>
          <span>Driver to Restaurant</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'green' }}></div>
          <span>Restaurant to Customer</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
