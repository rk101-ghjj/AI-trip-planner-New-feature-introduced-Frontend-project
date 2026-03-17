import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "tp_users_v1";
const SESSION_KEY = "tp_session_v1";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  const users = safeJsonParse(raw, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return safeJsonParse(raw, null);
}

function saveSession(session) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [session, setSession] = useState(() => loadSession());

  useEffect(() => saveUsers(users), [users]);
  useEffect(() => saveSession(session), [session]);

  const hasRegistered = users.length > 0;
  const user = session?.email ? users.find((u) => u.email === session.email) ?? null : null;

  const signup = useCallback((email, password) => {
    const trimmedEmail = String(email || "").trim().toLowerCase();
    const trimmedPassword = String(password || "");
    if (!trimmedEmail || !trimmedPassword) throw new Error("Email and password are required.");
    const existing = users.find((u) => u.email === trimmedEmail);
    if (existing) throw new Error("Account already exists. Please login.");
    const nextUsers = [...users, { email: trimmedEmail, password: trimmedPassword, createdAt: Date.now() }];
    setUsers(nextUsers);
    setSession({ email: trimmedEmail, loggedInAt: Date.now() });
    return true;
  }, [users]);

  const login = useCallback((email, password) => {
    const trimmedEmail = String(email || "").trim().toLowerCase();
    const trimmedPassword = String(password || "");
    const found = users.find((u) => u.email === trimmedEmail);
    if (!found) throw new Error("No account found. Please signup first.");
    if (found.password !== trimmedPassword) throw new Error("Invalid credentials.");
    setSession({ email: trimmedEmail, loggedInAt: Date.now() });
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    user,
    hasRegistered,
    isLoggedIn: Boolean(user),
    signup,
    login,
    logout,
  }), [user, hasRegistered, signup, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

