import IncidenceButton from "../../components/incidenceButton/IncidenceButton";
import LocateButton from "../../components/locateButton/LocateButton";
import PersonButton from "../../components/personButton/PersonButton";
import ExitButton from "../../components/exitButton/ExitButton";
import BottomSheet from "../../components/bottomSheet/BottomSheet";
import Map from "../../components/map/Map";
import { default as CustomMarker } from "../../components/marker/Marker";

import { getAppInfo } from "../../logic/config";
import { getIncidence, getIncidences } from "../../logic/incidence";
import { logout } from "../../logic/user";
import { isInside } from "../../logic/map";

import { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { Marker } from "react-leaflet";
import { motion } from "framer-motion";

import "./mainmap.css";
import { divIcon } from "leaflet";
import LanguageButtons from "../../components/languageButtons/LanguageButtons";
import { Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

function getMarkers(incidences, onClick) {
  const customMarker = divIcon({
    html: renderToString(<CustomMarker />),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: "custom-svg-icon",
  });
  let res = [];
  for (let incidence of incidences) {
    function handleOnClick() {
      if (onClick) {
        onClick(incidence);
      }
    }
    let marker = (
      <Marker
        position={incidence.coordinates}
        key={incidence.id}
        eventHandlers={{ click: handleOnClick }}
        icon={customMarker}
      />
    );
    res.push(marker);
  }
  return res;
}

function MainMap() {
  const [incidence, setIncidence] = useState(null);
  const [incidences, setIncidences] = useState(null);
  const [appInfo, setAppInfo] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { incidenceid } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleAppInfo(data) {
    if (!data || data.points == undefined || data.points.length < 4) {
      navigate("/config");
    } else {
      setAppInfo(data);
    }
  }

  useEffect(() => {
    getAppInfo(handleAppInfo);
    getIncidences((data) => setIncidences(data.incidences));
  }, []);

  useEffect(() => {
    if (!incidences || !incidenceid || !mapRef) {
      return;
    }

    for (let incidence of incidences) {
      if (incidence["id"] == incidenceid) {
        handleOnClickIncidence(incidence);
        window.history.pushState(null, null, '/');
      }
    }
  }, [incidences, mapRef]);

  function onClickLocate() {
    if (!mapRef) {
      return;
    }
    mapRef.locate().on("locationfound", function (e) {
      if (isInside([e.latlng.lat, e.latlng.lng], appInfo.points)) {
        mapRef.setView(e.latlng, 25);
      } else {
        // mostrar toast de que estas fuera del area de accion
      }
    });
  }

  function onClickLogOut() {
    logout(() => getAppInfo(handleAppInfo));
  }

  function onClickIncidenceButton() {
    if (!appInfo["logged"]) {
      navigate("/login");
      return;
    } else {
      navigate("/add_incidence");
    }
  }

  function handleOnClickIncidence(incidence) {
    mapRef.setView(incidence.coordinates, 25);
    getIncidence(incidence.id, setIncidence);
  }

  function handleOnClickMap() {
    setIncidence(null);
  }

  function handleOnContextMenuMap(e) {
    if (!e.latlng) {
      return;
    }
    let coordinates = [e.latlng.lat, e.latlng.lng];

    if (!isInside(coordinates, appInfo.points)) {
      setSnackBarMessage(
        t('error_use_area')
      );
      setOpenSnackBar(true);
      return;
    }

    if (!appInfo["logged"]) {
      navigate("/login");
      return;
    }

    navigate("/add_incidence", { state: { coordinates: coordinates } });
  }

  let markers = [];
  if (incidences) {
    markers = getMarkers(incidences, handleOnClickIncidence);
  }

  function onCloseIncidence() {
    setIncidence(null);
    getIncidences((data) => setIncidences(data.incidences));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      {appInfo != null ? (
        <Map
          limits={appInfo.points}
          setMapRef={setMapRef}
          onClickMap={handleOnClickMap}
          onContextMenu={handleOnContextMenuMap}
        >
          {markers}
        </Map>
      ) : null}
      <div className="topleftbuttons">
        <LocateButton onClick={onClickLocate} />
      </div>
      <div className="toprightbuttons">
        <LanguageButtons />
        {!appInfo ? null : appInfo["logged"] ? (
          <ExitButton onClick={onClickLogOut} />
        ) : (
          <PersonButton route={"/login"} />
        )}
      </div>
      <div className="bottomrightbuttons">
        <IncidenceButton onClick={onClickIncidenceButton} />
      </div>
      <Snackbar
        open={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
        message={snackBarMessage}
        autoHideDuration={6000}
      />
      <BottomSheet
        incidence={incidence}
        appInfo={appInfo}
        onCloseIncidence={onCloseIncidence}
      />
    </motion.div>
  );
}

export default MainMap;
