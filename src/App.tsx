import React from "react";
import { Route, Routes, Link } from "react-router-dom";

import Wavedots from "./routes/Wavedots";
import SimpleFlowFieldRoute from "./routes/SimpleFlowField";

import "./styles/base.scss";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wavedots" element={<Wavedots />} />
        <Route path="/flowField" element={<SimpleFlowFieldRoute />} />
      </Routes>
    </>
  );
};

const Home = () => {
  return (
    <>
      <Link to="/wavedots">Wavedots</Link>
      <Link to="/flowField">Flow Field</Link>
    </>
  );
};

export default App;
