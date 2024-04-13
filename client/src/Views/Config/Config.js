import { useNavigate } from "react-router";
import { getAppInfo } from "../../logic/config";
import { useEffect, useState } from "react";
import "./config.css";

import MapConfig from "./MapConfig";
import UsersConfig from "./UsersConfig";
import ClassesConfig from "./ClassesConfig";

function Config() {
  const [appInfo, setAppInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAppInfo((appInfo) => {
      if (!appInfo["user"] || !appInfo["user"]["is_admin"]) {
        navigate("/login");
      }
      setAppInfo(appInfo);
    });
  }, []);

  return (
    <div className="configContainer">
      {appInfo && <MapConfig limits={appInfo.points} />}
      <UsersConfig />
      {appInfo && <ClassesConfig classes={appInfo.classes} />}
    </div>
  );
}

export default Config;
