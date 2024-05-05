import { Checkbox } from "@mui/material";
import { useState } from "react";

function AppSettings({ appInfo }) {
  const [canOpenIncidences, setCanOpenIncidences] = useState();
  const [canComment, setCanComment] = useState();

  function onChangeUsersCanOpenIncidence(e) {
    console.log(e.target.checked);
  }

  function onChangeUsersCanComment(e) {
    console.log(e.target.checked);
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
