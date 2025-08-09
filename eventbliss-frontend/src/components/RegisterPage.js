import React, { useState } from "react";
import axios from "axios";
// useNavigate is no longer needed since we are doing a full page reload
// import { useNavigate } from "react-router-dom";

export default function RegisterPage(){
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  // const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://eventbliss-1.onrender.com/api/auth/register", { username: name, email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "");
      
      alert("Registration successful! Redirecting to events page.");
      // Use window.location.href to force a full page reload and update UI
      window.location.href = "/events";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding:10,
    borderRadius:8,
    border:"1px solid rgba(255,255,255,0.06)",
    background:"rgba(255,255,255,0.02)",
    color:"white",
    outline:"none"
  };

  const submitBtn = {
    padding:10,
    borderRadius:8,
    border:"none",
    background:"#4f46e5",
    color:"white",
    fontWeight:700,
    cursor:"pointer"
  };

  return (
    <div style={{ maxWidth:460, margin:"40px auto", padding:18, borderRadius:12, background:"rgba(255,255,255,0.04)" }}>
      <h2 style={{ color:"white", marginTop:0 }}>Register</h2>
      <form onSubmit={submit} style={{ display:"grid", gap:10 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={submitBtn} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
