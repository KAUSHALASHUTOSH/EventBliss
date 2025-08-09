import React, { useState } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "date") {
      const formattedDate = new Date(e.target.value).toISOString();
      setFormData({
        ...formData,
        date: formattedDate,
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://eventbliss-1.onrender.com/api/events", formData);
      alert("Event created successfully!");
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        image: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    }
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    outline: "none",
    fontSize: "1rem",
    background: "#333",
    color: "#eee",
    width: "100%",
  };

  const fileInputStyle = {
    padding: "10px",
    background: "#333",
    color: "#eee",
    borderRadius: "8px",
    border: "1px solid #444",
    outline: "none",
    fontSize: "1rem",
    width: "100%",
  };

  const labelStyle = {
    color: "#eee",
    fontSize: "1rem",
    marginBottom: "5px",
    marginTop: "10px",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  return (
    <Layout>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          padding: "2rem",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          color: "white",
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "2rem",
            textAlign: "center",
            color: "#eee",
          }}
        >
          Create a New Event
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date ? formData.date.split("T")[0] : ""}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Event Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              style={fileInputStyle}
            />
          </div>
          {formData.image && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
          <button
            type="submit"
            style={{
              background: "#eee",
              color: "#4f46e5",
              padding: "12px",
              borderRadius: "30px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.3s",
              marginTop: "15px",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Create Event
          </button>
        </form>
      </div>
    </Layout>
  );
}
