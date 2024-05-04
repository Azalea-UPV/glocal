import LoginButton from "../../components/loginButton/LoginButton";
import { login } from "../../logic/user";

import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import { motion } from "framer-motion";

import "./login.css";

function Login() {
  const [loginOk, setLoginOk] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mailRef = useRef();
  const passRef = useRef();

  function onLogin(ok) {
    if (ok) {
      navigate("/");
      return;
    }
    setLoginOk(ok? 1: loginOk-1);
    setIsLogin(false);
  }

  function onClickLogin() {
    if (isLogin) {
      return;
    }

    let mail = mailRef.current.value;
    let password = passRef.current.value;
    setIsLogin(true);
    try{
      login(mail, password, onLogin);
    } catch(e) {
      onLogin(false);
    }
  }

  function onClickRegister() {
    navigate("/signup");
  }

  function onKeyUpPassword(e) {
    if (e.key === "Enter") {
      onClickLogin();
    }
  }

  return (
    <motion.div
      className="loginBackground"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loginContainer">
        <div
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "1.5em",
          }}
        >
          {t("login")}
        </div>
        <TextField variant="outlined" inputRef={mailRef} label={t("email")} disabled={isLogin}/>
        <TextField
          variant="outlined"
          inputRef={passRef}
          label={t("password")}
          type="password"
          onKeyUp={onKeyUpPassword}
          disabled={isLogin}
        />
        <div style={{ marginTop: "30px" }}>
          <LoginButton onClick={onClickLogin} loginOk={loginOk} />
        </div>
        <div>{t("noAccount")}</div>
        <div
          style={{ color: "#2a8ff0", cursor: "pointer" }}
          onClick={onClickRegister}
        >
          {t("register")}
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
