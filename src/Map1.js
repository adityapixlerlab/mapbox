import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWRpdHlhMTAwMSIsImEiOiJja3g0aW0zemMwdmc2MnVxa25vZmljYmwxIn0.fNnPLeKkHAuGXDUqvq8b1g";

function Map1() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [75.8506, 30.9101],
        },
        properties: {
          title: "Ludhiana",
          description: "Sher Shah Suri Marg-GT Road",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [75.7683, 31.2201],
        },
        properties: {
          title: "Phagwara",
          description: "Bus Stand",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [75.4791, 31.1272],
        },
        properties: {
          title: "Nakodar",
          description: "Kapurthala-Nakodar Road",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [75.1745, 30.8265],
        },
        properties: {
          title: "Moga",
          description: "Hans Raj Hospital",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [76.1148, 31.1259],
        },
        properties: {
          title: "Nawashaher",
          description: "Arya Samaj Road",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [76.1442, 31.2155],
        },
        properties: {
          title: "Garshankar",
          description: "Dr. Vishesh Kumar",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [76.1637, 30.8471],
        },
        properties: {
          title: "Samrala",
          description: "Bharhla to NH95 Link Road",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [75.5756, 31.3315],
        },
        properties: {
          title: "Jalandhar",
          description: "Goel Hospital",
        },
      },
    ],
  };

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

    for (const feature of geojson.features) {
      const el = document.createElement("div");
      el.className = "marker";

      new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
          )
        )
        .addTo(map.current);
    }

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

    map.current.addControl(new mapboxgl.FullscreenControl());

    map.current.addControl(new mapboxgl.NavigationControl());
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div id="map"></div>
      <div ref={mapContainer} className="map-container" />
      <div id="geocoder" class="geocoder"></div>
    </div>
  );
}

export default Map1;
