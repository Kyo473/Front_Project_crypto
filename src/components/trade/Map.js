import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from './pin.png';

const MapComponent = ({ setLat, setLon }) => {
  const [position, setPosition] = useState([0, 0]);

  useEffect(() => {
    // Initialize the map only once
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const customMarker = new L.Icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const marker = L.marker(position, { icon: customMarker }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLat(lat);
      setLon(lng);

      marker.setLatLng([lat, lng]);
    });

 
    return () => {
      map.remove();
    };
  }, [position, setLat, setLon]);

  return <div id="map" style={{ height: '800px', width: '100%' }} />;
};

export default MapComponent;
