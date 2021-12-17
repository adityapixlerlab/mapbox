import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWRpdHlhMTAwMSIsImEiOiJja3g0aW0zemMwdmc2MnVxa25vZmljYmwxIn0.fNnPLeKkHAuGXDUqvq8b1g";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const coordinates = document.getElementById("coordinates");

  useEffect(() => {
    loadMap();
  });

  const loadMap = () => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([0, 0])
      .addTo(map.current);

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      coordinates.style.display = "block";
      coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    }

    marker.on("dragend", onDragEnd);
  };

  return (
    <div>
      <div id="map"></div>
      <pre id="coordinates" className="coordinates"></pre>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
