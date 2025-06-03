"use client";
import { useState } from "react";
import "@/stylesheets/adminLogin.css";
import Link from "next/link";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, secret }),
      });

      const data = await res.json();
      console.log(data)

      if (res.ok) {
        setMessageType("success");
        setMessage(data.message || "Login successful!");
        window.location.href = "/admin/dashboard";
      } else {
        setMessageType("error");
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Something went wrong");
      console.log(err)
    }

    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="container">
        {message && (
          <div
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
            {
              messageType === "success"
                && <Link href="/admin/dashboard" className="dashboard-link">Go to Dashboard</Link>
            }
          </div>
        )}

        <section className="login-section">
          <h3>Sign In</h3>
          <form onSubmit={handleLogin} className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="secret">Secret Key</label>
              <input
                type="text"
                id="secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </section>
    </div>
  );
};

export default AdminLogin;
