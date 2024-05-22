import TuneIcon from "@mui/icons-material/Tune";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const style = {
  backgroundColor: "white",
  color: "black",
  padding: "5px",
  borderRadius: "50px",
  cursor: "pointer",
  fontSize: "1.5em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function get_filters_elements(classes, showClasses, setShowClasses) {
  let res = [];
  for (let cls of Object.keys(classes)) {
    cls = classes[cls];
    const class_id = cls["id"];
    let show_class = showClasses[class_id];

    function onClickFilter() {
      let _showClasses = { ...showClasses };
      _showClasses[class_id] = !_showClasses[class_id];
      setShowClasses(_showClasses);
    }

    res.push(
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          gap: "10px",
          color: show_class ? "" : "gray",
          cursor: "pointer",
        }}
        onClick={onClickFilter}
        key={cls['id']}
      >
        {cls["iconurl"] && cls["iconurl"].trim() != "" && (
          <img
            src={cls["iconurl"]}
            style={{
              width: "25px",
              filter: show_class ? "" : "grayscale(100%)",
            }}
          />
        )}
        <>{cls["classname"]}</>
      </div>
    );
  }
  return res;
}

function Filters({ appInfo, incidences, setShownIncidences }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showClasses, setShowClasses] = useState([]);
  const { t } = useTranslation();
  const menuRef = useRef();

  let filtersElements = [];

  function handleClickOutside(event) {
    if (
      showMenu &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);

  useEffect(
    function () {
      if (appInfo && Object.keys(appInfo["classes"]).length > 0) {
        let classes = appInfo["classes"];
        let _showClasses = {};
        for (let cls of Object.keys(classes)) {
          cls = classes[cls];
          _showClasses[cls["id"]] = true;
        }
        setShowClasses(_showClasses);
      }
    },
    [appInfo]
  );

  useEffect(
    function () {
      if (!incidences) {
        return;
      }

      let _incidences = [];
      for (let incidence of incidences) {
        if (showClasses[incidence["class"]]) {
          _incidences.push(incidence);
        }
      }
      setShownIncidences(_incidences);
    },
    [showClasses, incidences]
  );

  if (!appInfo || Object.keys(appInfo["classes"]).length <= 1) {
    return <></>;
  }

  filtersElements = get_filters_elements(
    appInfo["classes"],
    showClasses,
    setShowClasses
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={style} onClick={() => setShowMenu(!showMenu)}>
        <TuneIcon />
      </div>
      {showMenu && (
        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "5px",
          }}
          ref={menuRef}
        >
          {t("show")}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            {filtersElements}
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
