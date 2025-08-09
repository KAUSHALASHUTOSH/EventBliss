import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import EventsPage from "./components/EventsPage";
import CreateEventPage from "./components/CreateEventPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import UserManagementPage from "./components/UserManagementPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Specific routes should come before more general routes */}
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/users" element={<Layout><UserManagementPage /></Layout>} />
        <Route path="/create" element={<Layout><CreateEventPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        {/* The catch-all route should always be last */}
        <Route path="*" element={<Layout><div style={{padding:40}}>404 — Page not found</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
  
}
