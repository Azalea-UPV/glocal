import { setPoints } from "../../logic/config";
import { Button } from "@mui/material";
import Map from "../../components/map/Map";
import { useRef, useState } from "react";

function MapConfig({ limits, t }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const editControlRef = useRef();
  let _lastDrawn = null;

  function onClickDraw() {
    if (!editControlRef.current || isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.enable();
    setIsDrawing(true);
  }

  function onClickSaveMap() {
    if (!editControlRef.current || !isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.completeShape();
    editControlRef.current._toolbars.draw._modes.polygon.handler.disable();
    setIsDrawing(false);
  }

  function onClickCancel() {
    if (!editControlRef.current || !isDrawing) {
      return;
    }
    editControlRef.current._toolbars.draw._modes.polygon.handler.disable();
    setIsDrawing(false);
  }

  function onDrawn(e) {
    if (_lastDrawn) {
      e.sourceTarget._layers[_lastDrawn._leaflet_id].remove();
    }
    let lastDrawn = e.layer;

    let points = [];
    for (let latlng of lastDrawn._latlngs[0]) {
      points.push([latlng.lat, latlng.lng]);
    }
    setPoints(points, function () {
      console.log("ok");
    });
  }

  return (
    <div>
      <div className="title">{t('limits')}</div>
      <p>{t('limits_are')}</p>
      {limits ? (
        <Map
          limits={limits}
          editControlRef={editControlRef}
          className={"configMap"}
          onDrawn={onDrawn}
          drawLatLngs={limits}
        />
      ) : null}
      <div>
        <Button disabled={isDrawing} onClick={onClickDraw}>
          {t('draw')}
        </Button>
        <Button disabled={!isDrawing} onClick={onClickSaveMap}>
          {t('save')}
        </Button>
        <Button disabled={!isDrawing} onClick={onClickCancel}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
}

export default MapConfig;
