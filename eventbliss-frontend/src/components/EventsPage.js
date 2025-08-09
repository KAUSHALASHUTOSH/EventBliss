import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch events from the local backend
    axios.get("https://eventbliss-1.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error fetching events:", err));

    // Get role from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        setUserRole(decoded.user.role); // Correctly accessing role from decoded payload
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`https://eventbliss-1.onrender.com/api/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleModify = (eventData) => {
    const newTitle = prompt("Enter new title:", eventData.title);
    const newDescription = prompt("Enter new description:", eventData.description);
    const newLocation = prompt("Enter new location:", eventData.location);
    const newDate = prompt("Enter new date (YYYY-MM-DD):", eventData.date);

    if (!newTitle || !newDescription || !newLocation || !newDate) return;

    axios
      .put(
        `https://eventbliss-1.onrender.com/api/events/${eventData._id}`,
        { title: newTitle, description: newDescription, location: newLocation, date: newDate }
      )
      .then((res) => {
        setEvents(events.map((e) => (e._id === eventData._id ? res.data : e)));
      })
      .catch((err) => {
        console.error("Modify failed", err);
        alert(err.response?.data?.message || "Failed to modify event.");
      });
  };

  const handleModifyImage = (eventData) => {
    const newImage = prompt("Enter new image URL:", eventData.image);
    if (!newImage) return;

    axios
      .put(
        `https://eventbliss-1.onrender.com/api/events/${eventData._id}`,
        { image: newImage },
      )
      .then((res) => {
        setEvents(events.map((e) => (e._id === eventData._id ? res.data : e)));
      })
      .catch((err) => {
        console.error("Modify image failed", err);
        alert(err.response?.data?.message || "Failed to modify event image.");
      });
  }

  const styles = {
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
      padding: "20px"
    },
    card: {
      background: "#2a2d34",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "15px",
      transition: "transform 0.2s ease",
      cursor: "pointer",
      color: "white"
    },
    img: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px"
    },
    btnDelete: {
      background: "#ff4d4f",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      marginTop: "10px",
      cursor: "pointer",
      marginRight: "10px"
    },
    btnModify: {
      background: "#1890ff",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      marginTop: "10px",
      cursor: "pointer",
      marginRight: "10px"
    },
    btnModifyImage: {
      background: "#33c94d",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      marginTop: "10px",
      cursor: "pointer"
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    },
    modalImg: {
      maxWidth: "90%",
      maxHeight: "90%",
      borderRadius: "8px"
    },
    text: {
      color: "white"
    }
  };

  return (
    <Layout>
      <div style={styles.container}>
        {events.map((ev) => (
          <div
            key={ev._id}
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <img
              src={ev.image}
              alt={ev.title}
              style={styles.img}
              onClick={() => setSelectedImage(ev.image)}
            />
            <h3 style={styles.text}>{ev.title}</h3>
            <p style={styles.text}>{ev.description}</p>
            {/* The line below is where the date formatting fix is applied */}
            <p style={styles.text}>{new Date(ev.date).toLocaleDateString()}</p>
            <p style={styles.text}>{ev.location}</p>
            
            {(userRole === "owner" || userRole === "admin") && (
              <div>
                <button style={styles.btnDelete} onClick={() => handleDelete(ev._id)}>
                  Delete
                </button>
                <button style={styles.btnModify} onClick={() => handleModify(ev)}>
                  Modify
                </button>
                <button style={styles.btnModifyImage} onClick={() => handleModifyImage(ev)}>
                  Modify Image
                </button>
              </div>
            )}
          </div>
        ))}

        {selectedImage && (
          <div style={styles.modal} onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full view" style={styles.modalImg} />
          </div>
        )}
      </div>
    </Layout>
  );
}
