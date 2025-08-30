import { Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
};

export default App;
