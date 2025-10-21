// Utility functions for OSRM and Nominatim services

// Geocoding function using Nominatim (free OpenStreetMap geocoding service)
export const geocodeLocation = async (location) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=in`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Route calculation using OSRM (free OpenStreetMap routing service)
export const calculateRoute = async (startLat, startLon, endLat, endLon) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false&alternatives=false&steps=false`
    );
    const data = await response.json();
    
    if (data && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance / 1000, // Convert meters to kilometers
        duration: route.duration / 60, // Convert seconds to minutes
        success: true
      };
    }
    return { success: false, error: 'No route found' };
  } catch (error) {
    console.error('Routing error:', error);
    return { success: false, error: error.message };
  }
};

// Combined function to get route details between two locations
export const getRouteDetails = async (startLocation, endLocation) => {
  try {
    // Geocode both locations
    const startCoords = await geocodeLocation(startLocation);
    const endCoords = await geocodeLocation(endLocation);
    
    if (!startCoords || !endCoords) {
      return {
        success: false,
        error: 'Could not find coordinates for one or both locations'
      };
    }
    
    // Calculate route
    const route = await calculateRoute(
      startCoords.lat, startCoords.lon,
      endCoords.lat, endCoords.lon
    );
    
    if (!route.success) {
      return route;
    }
    
    return {
      success: true,
      distance: route.distance,
      duration: route.duration,
      startLocation: startCoords.display_name,
      endLocation: endCoords.display_name,
      startCoords,
      endCoords
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
