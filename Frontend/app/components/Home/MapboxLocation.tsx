import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import mapboxSdk from "@mapbox/mapbox-sdk"; // Import the Mapbox SDK
import mapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
const geocodingService = mapboxGeocoding(mapboxClient);

function MapboxLocation({ location }: { location: string | null }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const mapContainer = "map";
    let map: mapboxgl.Map | null = null;

    // Initialize the map, setting center to Varna, Bulgaria
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [27.9147, 43.2141], // Coordinates for Varna, Bulgaria
      zoom: 12, // Adjusted zoom level for better city view
    });

    // Trigger a geocoding query if location is provided
    if (location) {
      geocodingService
        .forwardGeocode({
          query: location,
          limit: 1, // Limit to one result
        })
        .send()
        .then((response) => {
          const feature = response.body.features[0];
          if (feature) {
            const coords = feature.geometry.coordinates;
            map.setCenter(coords);
            map.flyTo({ center: coords, zoom: 12 });
          }
        });
    }

    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (inputValue) {
      geocodingService
        .forwardGeocode({
          query: inputValue,
          limit: 1, // Limit to one result
        })
        .send()
        .then((response) => {
          const feature = response.body.features[0];
          if (feature) {
            const coords = feature.geometry.coordinates;
            setInputValue(""); // Clear the input after search
            map.setCenter(coords);
            map.flyTo({ center: coords, zoom: 12 });
          }
        });
    }
  };

  return <div id="map" className="w-full h-[800px]" />;
}

export default MapboxLocation;
