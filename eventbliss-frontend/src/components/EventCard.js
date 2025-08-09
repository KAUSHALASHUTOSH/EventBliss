import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Corrected backend URL to your live Render endpoint
    axios.get("https://eventbliss.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        <h2 style={styles.title}>Upcoming Events</h2>
        <div style={styles.grid}>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} style={styles.card}>
                {event.image && (
                  <img src={event.image} alt={event.title} style={styles.image} />
                )}
                <div style={styles.details}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.date}>{event.date}</p>
                  <p style={styles.location}>{event.location}</p>
                  <p style={styles.description}>{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            // Display a message when no events are available
            <p style={styles.noEventsMessage}>No events found. Check back later!</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif" // Using a clean, modern font
  },
  title: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "2.5rem", // Using rem for better scaling
    fontWeight: "600",
    color: "#333"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    border: "1px solid #e0e0e0",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }
  },
  image: {
    width: "100%",
    height: "200px", // Increased height for better visual
    objectFit: "cover",
    borderBottom: "1px solid #e0e0e0"
  },
  details: {
    padding: "20px"
  },
  eventTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#4a4a4a"
  },
  date: {
    fontWeight: "600",
    color: "#2980b9", // Changed to a more modern blue
    marginBottom: "5px"
  },
  location: {
    color: "#7f8c8d", // Changed to a soft gray
    marginBottom: "15px",
    fontSize: "0.9rem"
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6"
  },
  noEventsMessage: {
    textAlign: "center",
    gridColumn: "1 / -1",
    fontSize: "1.2rem",
    color: "#7f8c8d",
    marginTop: "50px"
  }
};
