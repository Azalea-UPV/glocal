import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  useMap,
  Marker,
} from "react-leaflet";
import "./map.css";
import { getCenter, isInside } from "../../logic/map";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useState } from "react";
import { LatLng, divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { renderToString } from "react-dom/server";
import { default as CustomMarker } from "../../components/marker/Marker";
import { getTilesUrl } from "../../logic/config";

import L from "leaflet";

function _Map({
  onDrawn,
  drawLatLngs,
  editControlRef,
  setMapRef,
  onClickMap,
  onContextMenu,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }
    if (onClickMap) {
      map.on("click", onClickMap);
    }
    if (onContextMenu) {
      map.on("contextmenu", onContextMenu);
    }
  }, [map]);

  if (setMapRef) {
    setMapRef(map);
  }

  function onMountedEditControl(e) {
    if (editControlRef) {
      editControlRef.current = e;
    }
  }

  return (
    <>
      <FeatureGroup>
        <EditControl onMounted={onMountedEditControl} onCreated={onDrawn} />
        {drawLatLngs ? (
          <Polygon positions={drawLatLngs} color="#97d1dc" stroke={false}  />
        ) : null}
      </FeatureGroup>
      <TileLayer url={getTilesUrl()} />
    </>
  );
}

function Map({
  limits,
  className,
  editControlRef,
  onDrawn,
  drawLatLngs,
  children,
  setMapRef,
  onClickMap,
  onContextMenu,
  center,
  zoom,
}) {
  const [location, setLocation] = useState(null);

  if (!center && limits && limits.length >= 3) {
    center = getCenter(limits);
  } else if (!center) {
    center = [39.46975, -0.37739];
  }
  let latlng = new LatLng(center[0], center[1]);

  useEffect(() => {
    const handlePermission = async () => {
      await navigator.permissions.query({ name: "geolocation" });

      const watchId = navigator.geolocation.watchPosition(
        (geoPosition) => {
          const { latitude, longitude } = geoPosition.coords;
          setLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    };

    handlePermission();
  }, []);

  const iconCreateFunction = () => {
    return divIcon({
      html: renderToString(<CustomMarker />),
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      className: "custom-svg-icon",
    });
  };
  const userLocationIcon = L.icon({
    iconUrl: "/images/user-marker.svg",
    iconSize: [32, 32], // tamaño del icono
    iconAnchor: [32 / 2, 32 / 2], // punto de anclaje del icono
  });

  return (
    <MapContainer
      center={latlng}
      className={className ? className : "map"}
      zoomControl={false}
      zoom={zoom ? zoom : 17}
      maxZoom={18}
    >
      <_Map
        onDrawn={onDrawn}
        drawLatLngs={drawLatLngs}
        editControlRef={editControlRef}
        limits={limits}
        setMapRef={setMapRef}
        onClickMap={onClickMap}
        onContextMenu={onContextMenu}
      />

      {location && isInside(location, limits) && (
        <Marker position={location} key={1} icon={userLocationIcon}></Marker>
      )}
      <MarkerClusterGroup iconCreateFunction={iconCreateFunction}>
        {children}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default Map;
