import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { setConfigField } from "../../logic/config";

function AppSettings({ appInfo }) {
  const [canOpenIncidences, setCanOpenIncidences] = useState(false);
  const [canComment, setCanComment] = useState(false);
  console.log(appInfo)

  useEffect(function() {
    setCanOpenIncidences(appInfo['config']['can_open_incidences']);
    setCanComment(appInfo['config']['can_comment']);
  }, [appInfo]);

  function onChangeUsersCanOpenIncidence() {
    setConfigField('canOpenIncidence', !canOpenIncidences, function() {
      setCanOpenIncidences(!canOpenIncidences);
    });
  }

  function onChangeUsersCanComment() {
    setConfigField('canComment', !canComment, function() {
      setCanComment(!canComment);
    });
  }

  return (
    <div>
      <div>App settings</div>
      <div>
        <Checkbox
          checked={canOpenIncidences}
          onChange={onChangeUsersCanOpenIncidence}
        />
        Users can open incidences.
      </div>
      <div>
        <Checkbox checked={canComment} onChange={onChangeUsersCanComment} />
        Users can comment.
      </div>
    </div>
  );
}

export default AppSettings;
