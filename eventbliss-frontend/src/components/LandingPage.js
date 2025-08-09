import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage(){
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight: "60vh" }}>
      {/* Main frosted card — same look as you asked */}
      <div style={cardStyles.container}>
        <h1 style={cardStyles.h1}>Discover Your Next Great Event</h1>
        <p style={cardStyles.p}>From workshops to concerts — find experiences that spark your passion.</p>
        <div style={{ marginTop: 18 }}>
          <Link to="/events" style={cardStyles.cta}>Explore Events</Link>
          <Link to="/create" style={cardStyles.ctaAlt}>Host an Event</Link>
        </div>
      </div>
    </div>
  );
}

const cardStyles = {
  container: {
    width: "100%",
    maxWidth: 920,
    padding: "32px",
    borderRadius: 24,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    textAlign: "center",
    color: "white"
  },
  h1: { fontSize: "2.6rem", margin: 0, lineHeight: 1.05, fontWeight: 800 },
  p: { marginTop: 12, fontSize: "1.125rem", color: "rgba(255,255,255,0.85)" },
  cta: {
    display: "inline-block",
    marginRight: 12,
    marginTop: 8,
    padding: "12px 22px",
    borderRadius: 999,
    background: "white",
    color: "#4f46e5",
    fontWeight: 800,
    textDecoration: "none",
    boxShadow: "0 6px 20px rgba(79,70,229,0.12)",
    transition: "transform .18s ease"
  },
  ctaAlt: {
    display: "inline-block",
    marginLeft: 12,
    marginTop: 8,
    padding: "12px 22px",
    borderRadius: 999,
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.18)",
    fontWeight: 700,
    textDecoration: "none"
  }
};
