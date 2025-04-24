import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentLocation, getLocationName } from "../utils/location.util.js";

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const savedLocation = sessionStorage.getItem('userLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  const [loading, setLoading] = useState(!sessionStorage.getItem('userLocation'));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (sessionStorage.getItem('userLocation')) {
        return;
      }

      try {
        const { latitude, longitude } = await getCurrentLocation();
        const cityName = await getLocationName(latitude, longitude);
        const locationData = { latitude, longitude, cityName };

        sessionStorage.setItem('userLocation', JSON.stringify(locationData));
        setLocation(locationData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, loading, error, setLocation, setLoading, setError }}
    >
      {children}
    </LocationContext.Provider>
  );
};