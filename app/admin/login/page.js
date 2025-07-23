"use client";
import { useState } from "react";
import "@/stylesheets/adminLogin.css";
import Link from "next/link";
import Image from "next/image";

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
      console.log(err);
    }

    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="container">
      {message && (
        <div
          className={
            messageType === "success" ? "success-message" : "error-message"
          }
        >
          {message}
          {messageType === "success" && (
            <Link href="/admin/dashboard" className="dashboard-link">
              Go to Dashboard
            </Link>
          )}
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
    // <div className="min-h-screen bg-[#2e4057] flex flex-col items-center justify-center p-4">
    //   <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6">
    //     <Image
    //       src="/newChhaka.jpg"
    //       alt="Sample Image"
    //       width={400}
    //       height={300}
    //       className="w-full h-64 object-cover rounded-md mb-4"
    //     />
    //     <div className="text-center">
    //       <h1 className="text-2xl font-bold text-white mb-2">
    //         Mujhse Jyada shana ho gaya kya?
    //       </h1>
    //       <p className="text-gray-200">
    //         Bus Bhai Prince Maine banaya hai aur tu mujhse shana ban raha hai.
    //         &quot;Jinko Patthar se humne banaya sanam, vo khuda ho gaye
    //         dekhte dekhte.&quot;
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AdminLogin;
