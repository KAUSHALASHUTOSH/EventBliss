import React, { useState } from "react";
import axios from "axios";
// useNavigate is no longer needed since we are doing a full page reload
// import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
const res = await axios.post("https://eventbliss.onrender.com/api/auth/login", { email, password });      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "");
      
      alert("Login successful! Redirecting to events page.");
      // Use window.location.href to force a full page reload and update UI
      window.location.href = "/events";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)", color:"white" };
  const submitBtn = { padding:10, borderRadius:8, border:"none", background:"#10b981", color:"white", fontWeight:700 };

  return (
    <div style={{ maxWidth:420, margin:"40px auto", padding:18, borderRadius:12, background:"rgba(255,255,255,0.04)" }}>
      <h2 style={{ color:"white", marginTop:0 }}>Login</h2>
      <form onSubmit={submit} style={{ display:"grid", gap:10 }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={submitBtn}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}
