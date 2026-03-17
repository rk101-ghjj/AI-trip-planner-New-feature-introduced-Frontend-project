import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { setSearchQuery } from "../redux/tripSlice.js";
import Chatbox from "./Chatbox.jsx";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const searchQuery = useSelector((s) => s.trip.searchQuery);
  const initials = useMemo(() => {
    const e = user?.email || "";
    return e ? e.slice(0, 2).toUpperCase() : "TP";
  }, [user?.email]);

  return (
    <nav className="navbar navbar-light bg-white shadow-sm fixed-top px-3">
      <div className="d-flex align-items-center gap-2" style={{ minWidth: 220 }}>
        <button
          type="button"
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2"
          onClick={() => navigate("/app")}
          aria-label="Go to dashboard"
        >
          <div className="tp-logo">{initials}</div>
          <div className="text-start">
            <div className="fw-bold" style={{ lineHeight: 1.05, color: "#111" }}>
              Trip Planner
            </div>
            <div className="text-muted" style={{ fontSize: 12, lineHeight: 1.05 }}>
              Plan smarter, travel better
            </div>
          </div>
        </button>
      </div>

      <div className="flex-grow-1 px-3" style={{ maxWidth: 720 }}>
        <input
          className="form-control"
          placeholder="Search destination (e.g., Goa, Paris, Bali)..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="tp-header-chat">
          <Chatbox placement="header" />
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

