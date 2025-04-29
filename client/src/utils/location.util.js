// Get user's current location coordinates
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Convert coordinates to city name using OpenCage API
export const getLocationName = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1c3787f9fd174abe89c7143da2146b3f`
  );
  const data = await response.json();

  const city =
    data.results?.[0]?.components?.city ||
    data.results?.[0]?.components?.town ||
    data.results?.[0]?.components?.suburb ||
    data.results?.[0]?.components?.municipality;

  if (!city) {
    console.log("No city found in response:", data.results?.[0]?.components);
    throw new Error("Location found but city unknown");
  }

  return city;
};
