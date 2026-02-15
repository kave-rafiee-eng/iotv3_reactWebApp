import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home"; // adjust path/filename if needed (case-sensitive!)
import Log from "./log"; // ← add this import (create the file if missing)

import NavBar from "./navBar";
// If this is your main app component, consider renaming it to App
function AppRecorder() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<Log />} />{" "}
      </Routes>
    </>
  );
}

export default AppRecorder;
