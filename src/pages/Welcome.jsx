import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Welcome() {
  const navigate = useNavigate();
  const { login, signup, isLoggedIn } = useAuth();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/app", { replace: true });
  }, [isLoggedIn, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (tab === "signup") {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await signup(email, password);
      } else {
        await login(email, password);
      }
      resetForm();
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-bg" />

      {/* HERO CENTER */}
      <div className="welcome-hero">
        <h1 className="welcome-title">
          <span className="line">WELCOME TO</span>
          <span className="brand">TRIP PLANNER</span>
        </h1>
        <p className="welcome-subtitle">Plan smarter. Travel better.</p>
      </div>

      {/* LOGIN CARD */}
      <div className="login-card card shadow-lg p-4">
        <ul className="nav nav-pills nav-fill mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setError("");
                resetForm();
              }}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${tab === "signup" ? "active" : ""}`}
              onClick={() => {
                setTab("signup");
                setError("");
                resetForm();
              }}
            >
              Signup
            </button>
          </li>
        </ul>

        <p className="text-muted mb-3" style={{ fontSize: 14 }}>
          {tab === "signup"
            ? "Create an account to save your trips."
            : "Welcome back. Login to continue."}
        </p>

        {error && (
          <div className="alert alert-danger py-2" role="alert" style={{ fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label className="form-label text-start w-100" style={{ fontSize: 13 }}>
            Email
          </label>
          <input
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label className="form-label text-start w-100" style={{ fontSize: 13 }}>
            Password
          </label>
          <input
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          {tab === "signup" && (
            <>
              <label className="form-label text-start w-100" style={{ fontSize: 13 }}>
                Confirm Password
              </label>
              <input
                className="form-control mb-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
              />
            </>
          )}

          <button className="btn btn-primary w-100" type="submit">
            {tab === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .welcome-page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .welcome-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          z-index: -1;
        }

        .welcome-hero {
          position: absolute;
          top: 18%;
          width: 100%;
          text-align: center;
          color: white;
          animation: fadeSlide 1.2s ease-in-out;
        }

        .welcome-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .line {
          font-size: 30px;
          letter-spacing: 4px;
        }

        .brand {
          font-size: 70px;
          font-weight: 900;
          background: linear-gradient(90deg, #ff9a9e, #fad0c4, #fbc2eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0px 10px 25px rgba(255,255,255,0.3);
        }

        .welcome-subtitle {
          font-size: 18px;
          margin-top: 10px;
        }

        .login-card {
          position: absolute;
          bottom: 10%;
          width: 360px;
          border-radius: 15px;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}