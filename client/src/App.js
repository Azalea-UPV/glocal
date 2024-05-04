import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainMap from "./Views/MainMap/MainMap"
import Config from "./Views/Config/Config";
import Login from "./Views/Login/Login";
import AddIncidence from "./Views/AddIncidence/AddIncidence";
import SignUp from "./Views/SignUp/SignUp";

import { I18nextProvider } from 'react-i18next';
import i18n from "./language/i18n";

function _App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainMap />} />
        <Route path="/incidence/:incidenceid" element={<MainMap/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/config" element={<Config />} />
        <Route exact path="/add_incidence" element={<AddIncidence/>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <_App/>
      </Router>
    </I18nextProvider>
  );
}

export default App;
