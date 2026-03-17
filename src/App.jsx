import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Welcome />} />
    </Routes>
  );
}

export default App;

