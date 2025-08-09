import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export default function UserManagementPage() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          nav("/login");
          return;
        }
        
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setMessage(err.response?.data?.message || "Failed to load users.");
        if (err.response?.status === 403 || err.response?.status === 401) {
          nav("/events"); 
        }
      } finally {
        setLoading(false);
      }
    };
    
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");
    setCurrentUser(storedUserId);

    if (storedRole === "owner") {
      fetchUsers();
    } else {
      nav("/events");
    }
  }, [nav]);

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${userId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User role updated successfully!");
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update user role.");
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this user's status to ${newStatus}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/status/${userId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User status updated successfully!");
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User deleted successfully!");
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const cardStyle = {
    padding: 24,
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    color: "white"
  };

  const tableHeaderStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  };

  const tableCellStyle = {
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.05)"
  };

  const buttonStyle = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginRight: "8px"
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-gray-100 max-w-full overflow-x-auto">
        <h2 className="text-2xl font-bold text-center mb-6">User Management</h2>
        {message && <div className={`text-center mb-4 p-2 rounded-md ${message.includes('successful') ? 'bg-green-500' : 'bg-red-500'}`}>{message}</div>}
        
        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">User ID</th>
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">Username</th>
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">Email</th>
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">Role</th>
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-sm text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-sm text-gray-300">{user._id}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{user.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      disabled={user._id === currentUser}
                      className="bg-gray-700 border border-gray-600 rounded-md p-1 text-sm focus:outline-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                     <select
                      value={user.status}
                      onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                      disabled={user._id === currentUser}
                      className="bg-gray-700 border border-gray-600 rounded-md p-1 text-sm focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="frozen">Frozen</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {user._id !== currentUser && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
