import { useEffect, useRef, useState } from "react";
import { getAppInfo } from "../../logic/config";
import { addIncidence } from "../../logic/incidence";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { motion } from "framer-motion";
import Map from "../../components/map/Map";
import { useLocation, useNavigate } from "react-router-dom";
import Marker from "../../components/marker/Marker";
import { useTranslation } from "react-i18next";
import "./addincidence.css";

function getClassesMenuItems(appinfo, t) {
  if (!appinfo || !appinfo["classes"] || appinfo["classes"].length <= 0) {
    return [];
  }

  let res = {};
  
  for (let cls of Object.values(appinfo["classes"])) {
    res[cls["id"]] = (
      <MenuItem
        value={cls["id"]}
        className={'classSelect'}
      >
        {cls["iconurl"] && cls["iconurl"].trim() && (
          <img src={cls["iconurl"]} style={{ height: "30px" }} />
        )}
        {cls["classname"]}
      </MenuItem>
    );
  }
  res[-1] = (<MenuItem value={-1}>{t("other")}</MenuItem>);

  return res;
}

function AddIncidence() {
  const { t } = useTranslation();
  const [appInfo, setAppInfo] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [saving, setSaving] = useState(false);
  const [cls, setCls] = useState(-1);
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

  let classesMenuItems = getClassesMenuItems(appInfo, t);

  function onClickSave() {
    setSaving(true);
    let latlng = mapRef.getCenter();
    let incidence = {
      short_description: shortDescriptionRef.current.value,
      long_description: longDescriptionRef.current.value,
      coordinates: [latlng.lat, latlng.lng],
    };
    if (cls != -1) {
      incidence['class'] = cls;
    }
    addIncidence(incidence, function (data) {
      //----------handle error----------------
      if (data.status != 200) {
        setSaving(false);
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
      {appInfo && appInfo["classes"] && Object.values(appInfo["classes"]).length > 0 && (
        <>
          <div className="locationtitle">{t("class")}</div>
          <Select style={{ width: "100%", height: '50px'}} value={cls} onChange={(event) => setCls(event.target.value)}>
            {Object.values(classesMenuItems)}
          </Select>
        </>
      )}
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
      <Button onClick={onClickSave} disabled={saving}>{t("save")}</Button>
    </motion.div>
  );
}

export default AddIncidence;
