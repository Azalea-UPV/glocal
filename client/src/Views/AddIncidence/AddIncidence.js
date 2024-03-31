import { useEffect, useRef, useState } from "react";
import { getAppInfo } from "../../logic/config";
import { addIncidence } from "../../logic/incidence";
import { Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import Map from "../../components/map/Map";
import { useLocation, useNavigate } from "react-router-dom";
import "./addincidence.css";
import Marker from "../../components/marker/Marker";
import { useTranslation } from "react-i18next";

function AddIncidence() {
  const { t } = useTranslation();
  const [appInfo, setAppInfo] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const shortDescriptionRef = useRef();
  const longDescriptionRef = useRef();

  function handleAppInfo(data) {
    if (!data || !data.logged) {
      navigate("/login");
    } else {
      setAppInfo(data);
    }
  }
  useEffect(() => getAppInfo(handleAppInfo), []);

  function onClickSave() {
    let latlng = mapRef.getCenter();
    let incidence = {
      short_description: shortDescriptionRef.current.value,
      long_description: longDescriptionRef.current.value,
      coordinates: [latlng.lat, latlng.lng],
    };
    addIncidence(incidence, function (data) {
      //----------handle error----------------
      if (data.status != 200) {
          return;
      }
      navigate("/");
    });
  }

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="title">{t("incidence")}</div>
      <TextField
        variant="outlined"
        label={t("title")}
        fullWidth
        inputRef={shortDescriptionRef}
      />
      <TextField
        variant="outlined"
        label={t("description")}
        multiline
        rows={4}
        fullWidth
        inputRef={longDescriptionRef}
      />
      <div className="locationtitle">{t("location")}</div>
      {appInfo != null ? (
        <Map
          limits={appInfo.points}
          className={"addIncidenceMap"}
          setMapRef={setMapRef}
          center={
            location.state && location.state.coordinates
              ? location.state.coordinates
              : null
          }
          drawLatLngs={appInfo.points}
        >
          <div className="makerContainer">
            <Marker />
          </div>
        </Map>
      ) : null}
      <Button onClick={onClickSave}>{t("save")}</Button>
    </motion.div>
  );
}

export default AddIncidence;
