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

    const lngDisplay = document.getElementById("lng");
    const latDisplay = document.getElementById("lat");
    const eleDisplay = document.getElementById("ele");

    const marker = new mapboxgl.Marker({
      color: "#314ccd",
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));

      getElevation();
    });

    async function getElevation() {
      // Construct the API request
      const query = await fetch(
        `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${lng},${lat}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      if (query.status !== 200) return;
      const data = await query.json();
      // Display the longitude and latitude values
      lngDisplay.textContent = lng.toFixed(2);
      latDisplay.textContent = lat.toFixed(2);
      // Get all the returned features
      const allFeatures = data.features;
      // For each returned feature, add elevation data to the elevations array
      const elevations = allFeatures.map((feature) => feature.properties.ele);
      // In the elevations array, find the largest value
      const highestElevation = Math.max(...elevations);
      // Display the largest elevation value
      eleDisplay.textContent = `${highestElevation} meters`;
    }
  };

  return (
    <div>
      <div id="map"></div>
      <div class="ele-info">
        <div>
          Longitude:&nbsp;<span id="lng"></span>
        </div>
        <div>
          Latitude:&nbsp;<span id="lat"></span>
        </div>
        <div>
          Elevation:&nbsp;<span id="ele"></span>
        </div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Map;
