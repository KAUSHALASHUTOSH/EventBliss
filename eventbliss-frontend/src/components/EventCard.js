import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("https://eventbliss-1.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  return (
    <Layout>
      <div style={styles.container}>
        <h2 style={styles.title}>Upcoming Events</h2>
        <div style={styles.grid}>
          {events.map((event) => (
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
          ))}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px"
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "bold"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer"
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover"
  },
  details: {
    padding: "15px"
  },
  eventTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px"
  },
  date: {
    fontWeight: "500",
    color: "#007bff",
    marginBottom: "5px"
  },
  location: {
    color: "gray",
    marginBottom: "10px"
  },
  description: {
    fontSize: "14px",
    color: "#555"
  }
};
