"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, User, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(data.message || "Invalid username or password");
      }
    } catch (err: any) {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--bg-darker)",
      position: "relative"
    }}>
      {/* Decorative Glows */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "30%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(0, 162, 232, 0.05) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div className="glass login-card" style={{
        width: "100%",
        maxWidth: "400px",
        padding: "40px 32px",
        background: "rgba(11, 16, 27, 0.8)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(0, 162, 232, 0.08)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 162, 232, 0.2)",
            marginBottom: "16px",
            color: "var(--primary)"
          }}>
            <ShieldAlert size={28} />
          </div>
          <h1 style={{ fontSize: "1.75rem", color: "var(--white)", fontWeight: 700, margin: 0 }}>
            Admin Portal
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "6px" }}>
            Sign in to manage catalog categories &amp; products
          </p>
        </div>

        {/* Back Link */}
        <Link href="/" style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.8rem",
          fontWeight: 600
        }}>
          <ArrowLeft size={12} /> Site
        </Link>

        {/* Alert message */}
        {errorMsg && (
          <div className="form-alert form-alert-error" style={{ marginBottom: "20px" }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="username">Username</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                id="username"
                required
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <User size={16} style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                id="password"
                required
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: "10px",
              width: "100%",
              marginTop: "8px",
              fontSize: "0.95rem"
            }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
