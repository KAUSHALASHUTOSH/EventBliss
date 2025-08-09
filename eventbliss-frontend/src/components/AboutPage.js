import React, { useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await axios.post("https://eventbliss.onrender.com/api/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start justify-center gap-12 py-12 px-4 frosted-card rounded-3xl shadow-2xl border border-gray-700 animate-fade-in">
        
        {/* About Section */}
        <div className="flex-1 max-w-lg">
          <h2 className="text-4xl font-extrabold text-white mb-4">About EventBliss</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            EventBliss is your premier platform for discovering and managing unforgettable experiences. Whether you're looking to attend a workshop, a concert, or host your own event, we provide a seamless and intuitive interface to connect people with their passions. Our mission is to make event planning simple and fun for everyone.
          </p>

          <h3 className="text-2xl font-bold text-white mb-4">Find us on Social Media</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">GitHub</a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 max-w-lg w-full">
          <h2 className="text-4xl font-extrabold text-white mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {status === "success" && (
              <p className="text-green-400 mt-2">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-400 mt-2">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
