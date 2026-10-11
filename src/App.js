import React, { useState } from "react";
import { AuthProvider, useAuth } from "./firebase/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function AppRoutes() {
  const { currentUser } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (currentUser) return <Dashboard />;

  return showRegister ? (
    <Register onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onSwitchToRegister={() => setShowRegister(true)} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
