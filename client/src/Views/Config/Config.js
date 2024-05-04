import { useNavigate } from "react-router";
import { getAppInfo } from "../../logic/config";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./config.css";

import MapConfig from "./MapConfig";
import UsersConfig from "./UsersConfig";
import ClassesConfig from "./ClassesConfig";

function Config() {
  const [appInfo, setAppInfo] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      {appInfo && <MapConfig limits={appInfo.points} t={t} />}
      <UsersConfig t={t} />
      {appInfo && <ClassesConfig classes={appInfo.classes} t={t} />}
    </div>
  );
}

export default Config;
