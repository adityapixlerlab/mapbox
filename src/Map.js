import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWRpdHlhMTAwMSIsImEiOiJja3g0aW0zemMwdmc2MnVxa25vZmljYmwxIn0.fNnPLeKkHAuGXDUqvq8b1g";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    document.getElementById("geocoder").appendChild(geocoder.onAdd(map.current));

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },

        trackUserLocation: true,

        showUserHeading: true,
      })
    );

    map.current.addControl(new mapboxgl.NavigationControl());

    map.current.addControl(new mapboxgl.FullscreenControl());
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div id="map"></div>
      <div ref={mapContainer} className="map-container" />
      <div id="full"></div>
      <div id="geocoder" class="geocoder"></div>
    </div>
  );
}

export default Map;
