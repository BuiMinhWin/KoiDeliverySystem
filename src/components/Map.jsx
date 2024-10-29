import React, { useState, useEffect } from 'react';
import ReactMapGL, { Source, Layer } from '@goongmaps/goong-map-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const goongApiKey = import.meta.env.VITE_MAPTILES_KEY;
const API_KEY = import.meta.env.VITE_GOONG_API_KEY;

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${API_KEY}`
    );
    const data = response.data;

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      throw new Error("No results found for the address.");
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    throw new Error("Failed to fetch geocode.");
  }
};

const Map = () => {
  const location = useLocation();
  const { destination } = location.state || { destination: null };
  const [viewport, setViewport] = useState({
    width: '100vw', // Chiếm toàn bộ chiều rộng
    height: '100vh', // Chiếm toàn bộ chiều cao
    latitude: 10.8231, // Vĩ độ mặc định (có thể được cập nhật sau)
    longitude: 106.6297, // Kinh độ mặc định (có thể được cập nhật sau)
    zoom: 14, // Zoom vào vị trí hiện tại
  });
  
  const [route, setRoute] = useState(null);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);

  useEffect(() => {
    // Lấy vị trí hiện tại
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setOriginCoordinates({ lat: latitude, lng: longitude });
        setViewport((prev) => ({
          ...prev,
          latitude: latitude, // Cập nhật latitude
          longitude: longitude, // Cập nhật longitude
        }));

        if (destination) {
          const destinationCoords = await geocodeAddress(destination);
          setDestinationCoordinates(destinationCoords);
        }
      }, () => {
        console.error("Không thể lấy vị trí hiện tại.");
      });

      return () => {
        navigator.geolocation.clearWatch(watchId); // Dọn dẹp watcher khi component unmount
      };
    } else {
      console.error("Không thể lấy vị trí hiện tại.");
    }
  }, [destination]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (originCoordinates && destinationCoordinates) {
        try {
          const response = await axios.get(
            `https://rsapi.goong.io/Direction?origin=${originCoordinates.lat},${originCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&vehicle=car&api_key=${API_KEY}`
          );
          const routeData = response.data.routes[0].overview_polyline.points;
          setRoute(routeData);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      }
    };

    fetchRoute();
  }, [originCoordinates, destinationCoordinates]);

  const decodePolyline = (str) => {
    let index = 0, lat = 0, lng = 0, coordinates = [], shift, result, byte;
    while (index < str.length) {
      shift = result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lat += ((result & 1) ? ~(result >> 1) : (result >> 1));
      
      shift = result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lng += ((result & 1) ? ~(result >> 1) : (result >> 1));
      coordinates.push([lng / 1e5, lat / 1e5]);
    }
    return coordinates;
  };

  const zoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom + 1 }));
  };

  const zoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom - 1 }));
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100vw', height: '100vh' }}>
      <ReactMapGL
        {...viewport}
        goongApiAccessToken={goongApiKey}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        scrollZoom={true}
      >
        {route && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: decodePolyline(route),
              }
            }}
          >
            <Layer
              id="route-layer"
              type="line"
              paint={{
                "line-color": "#ff0000",
                "line-width": 4,
              }}
            />
          </Source>
        )}
      </ReactMapGL>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={zoomIn} style={{ margin: '5px', padding: '10px' }}>Zoom In</button>
        <button onClick={zoomOut} style={{ margin: '5px', padding: '10px' }}>Zoom Out</button>
      </div>
    </div>
  );
};

export default Map;
