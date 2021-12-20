import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
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
          coordinates: [-71.0548, 42.3601],
        },
        properties: {
          title: "Boston",
          description: "Quincy Market",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0624, 42.3631],
        },
        properties: {
          title: "West End",
          description: "West End Market",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0543, 42.3647],
        },
        properties: {
          title: "North End ",
          description: "Polcari Park",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0678, 42.3592],
        },
        properties: {
          title: "Beacon Hill",
          description: "Beacon Hill Market",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0554, 42.3557],
        },
        properties: {
          title: "Financial District",
          description: "franklin St",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0626, 42.352],
        },
        properties: {
          title: "China Tower",
          description: "Washington St",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0502, 42.3576],
        },
        properties: {
          title: "Water Front",
          description: "Harbol Towers",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-71.0771, 42.341],
        },
        properties: {
          title: "South End",
          description: "South End Library Park",
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
      marker: false,
      bbox: [-179.9, 18.8163608007951, -66.8847646185949, 71.4202919997506], // Boundary for us
      proximity: {
        longitude: -97.9222112121185,
        latitude: 39.3812661305678,
      },
    });

    geocoder.on("results", function (res) {
      console.log(res);
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

    map.current.addControl(new mapboxgl.FullscreenControl(), "top-left");

    var nav = new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
    });

    map.current.addControl(nav, "bottom-left");

    map.current.on("load", function () {
      let _center = turf.point([-71.0548, 42.3601]);
      let _radius = 6;
      let _options = {
        units: "kilometers",
      };

      let _circle = turf.circle(_center, _radius, _options);

      map.current.addSource("circleData", {
        type: "geojson",
        data: _circle,
      });

      map.current.addLayer({
        id: "circle-fill",
        type: "fill",
        source: "circleData",
        paint: {
          "fill-color": "#3498DB ",
          "fill-opacity": 0.3,
        },
      });
    });
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div>
        <button className="fullscreen">Expand</button>
      </div>
      <div className="btn">
        <button className="btn1">50</button>
        <button className="btn1">100</button>
        <button className="btn1">200</button>
      </div>
      <div id="map"></div>
      <div ref={mapContainer} className="map-container" />
      <div id="geocoder" className="geocoder"></div>
    </div>
  );
}

export default Map1;
