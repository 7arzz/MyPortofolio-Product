import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "./App.css";

// Public Pages
import Home from "./pages/Home";
import Works from "./pages/Works";
import Contact from "./pages/Contact";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AddWork from "./pages/admin/AddWork";
import EditWork from "./pages/admin/EditWork";
import Settings from "./pages/admin/Settings";

// Firebase
import { initializeSettings } from "./firebase/firestore";

export default function App() {
  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/works" element={<Works />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/add" element={<AddWork />} />
      <Route path="/admin/edit/:id" element={<EditWork />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  );
}
