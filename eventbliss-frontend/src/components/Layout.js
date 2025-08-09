import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    setToken(storedToken);
    setRole(storedRole);
    
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    
    delete axios.defaults.headers.common["Authorization"];
    
    setToken(null);
    setRole(null);
    window.location.href = "/";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ${scrolled ? 'bg-gray-800 shadow-lg' : 'bg-transparent'}`}>
        <div className="text-xl font-extrabold tracking-wider">
          <Link to="/" className="text-white no-underline">EventBliss</Link>
        </div>

        <nav className="flex items-center space-x-4">
          <NavLink to="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</NavLink>
          <NavLink to="/events" className="text-gray-300 hover:text-white transition-colors duration-200">Events</NavLink>
          { (role === "admin" || role === "owner") && <NavLink to="/create" className="text-gray-300 hover:text-white transition-colors duration-200">Create</NavLink> }
          { (role === "owner") && <NavLink to="/users" className="text-gray-300 hover:text-white transition-colors duration-200">Users</NavLink> }
          { token ? (
            <>
              <NavLink to="/profile" className="text-gray-300 hover:text-white transition-colors duration-200">Profile</NavLink>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-300 hover:text-white transition-colors duration-200">Login</NavLink>
              <NavLink to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto pt-24 px-4">
        {children}
      </main>
    </div>
  );
}
