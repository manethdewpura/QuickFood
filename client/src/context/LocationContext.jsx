import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentLocation, getLocationName } from "../utils/location.util.js";

// Create a context for location data
const LocationContext = createContext();

// Custom hook to use location context
export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  // Initialize location state from session storage if available
  const [location, setLocation] = useState(() => {
    const savedLocation = sessionStorage.getItem('userLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  // State to track loading status
  const [loading, setLoading] = useState(!sessionStorage.getItem('userLocation'));

  // State to track errors
  const [error, setError] = useState(null);

  // Load user location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      // Skip if location already exists in session storage
      if (sessionStorage.getItem('userLocation')) {
        return;
      }

      try {
        // Get current latitude and longitude
        const { latitude, longitude } = await getCurrentLocation();

        // Get city name based on latitude and longitude
        const cityName = await getLocationName(latitude, longitude);

        // Create location data object
        const locationData = { latitude, longitude, cityName };

        // Save location data to session storage
        sessionStorage.setItem('userLocation', JSON.stringify(locationData));

        // Update state with location data
        setLocation(locationData);
        setLoading(false);
      } catch (error) {
        // Handle errors and update state
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    // Provide location context values to children components
    <LocationContext.Provider
      value={{ location, loading, error, setLocation, setLoading, setError }}
    >
      {children}
    </LocationContext.Provider>
  );
};