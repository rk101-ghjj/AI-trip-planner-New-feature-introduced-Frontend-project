import React from "react";
import Header from "../components/Header.jsx";
import Recommendations from "../components/Recommendations.jsx";
import TripForm from "../components/TripForm.jsx";

export default function Dashboard() {
  return (
    <div className="tp-surface tp-surface-grid min-vh-100 d-flex flex-column">
      <Header />
      <div
        className="container-fluid flex-grow-1"
        style={{
          paddingTop: 86,
          paddingBottom: 16,
          minHeight: "calc(100vh - 86px)",
        }}
      >
        <div className="row g-3 h-100 align-items-stretch">
          <div className="col-md-4 h-100 d-flex">
            <Recommendations />
          </div>
          <div className="col-md-8 h-100 d-flex">
            <TripForm />
          </div>
        </div>
      </div>
    </div>
  );
}

