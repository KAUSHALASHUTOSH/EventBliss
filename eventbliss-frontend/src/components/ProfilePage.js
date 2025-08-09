import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const nav = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profile_pic: ""
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true; 
    
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
            nav("/login");
        }
        return;
      }
      
      if (isMounted) {
          setLoading(true);
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (isMounted) {
          setUserData(res.data);
          setMessage("Profile loaded successfully.");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        if (isMounted) {
          setMessage(err.response?.data?.message || "Failed to load profile.");
        }
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("name");
          if (isMounted) {
            nav("/login");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [nav]);

  const handleProfileChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        nav("/login");
        return;
      }
      const res = await axios.put("http://localhost:5000/api/users/me", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("name", userData.username);
      
      setMessage(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        nav("/login");
        return;
      }
      const res = await axios.put("http://localhost:5000/api/users/me", { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessage("This is a placeholder for image upload. Save your profile to update the URL.");
      const fileUrl = URL.createObjectURL(file);
      setUserData({ ...userData, profile_pic: fileUrl });
    }
  };

  const inputStyle = { padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)", color:"white" };
  const submitBtn = { padding:10, borderRadius:8, border:"none", background:"#4f46e5", color:"white", fontWeight:700, cursor:"pointer" };
  
  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, borderRadius: 12, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(6px)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}>
        <h2 style={{ color: "white", marginTop: 0, textAlign: "center" }}>My Profile</h2>
        {message && <div style={{ color: message.includes("successfully") ? "lime" : "red", textAlign: "center", marginBottom: 16 }}>{message}</div>}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {userData.profile_pic ? (
              <img src={userData.profile_pic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "3rem", color: "white" }}>👤</span>
            )}
          </div>
          <label htmlFor="profile-pic" style={{ marginTop: 12, padding: "8px 16px", background: "white", color: "#4f46e5", borderRadius: 999, cursor: "pointer", fontWeight: "bold" }}>
            Change Photo
          </label>
          <input id="profile-pic" type="file" onChange={handleImageUpload} style={{ display: "none" }} />
        </div>

        <form onSubmit={handleProfileSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleProfileChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={userData.email}
            onChange={handleProfileChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={submitBtn} disabled={loading}>
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>

        <h3 style={{ color: "white", marginTop: 40, marginBottom: 16 }}>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={{ ...submitBtn, background: "#ef4444" }} disabled={loading}>
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </Layout>
  );
}