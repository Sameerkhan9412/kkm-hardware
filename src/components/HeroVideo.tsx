"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow it down for elegant cinema feel
    }
  }, []);

  const scrollToCategories = () => {
    const el = document.getElementById("categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-container" style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: "var(--bg-darker)"
    }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
          opacity: 0.35, // Low opacity for legibility of text
        }}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-home-entrance-with-wooden-door-40816-large.mp4" type="video/mp4" />
        {/* Fallback image */}
      </video>

      {/* Cyber overlay textures */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, rgba(9, 13, 22, 0.4) 0%, var(--bg) 95%)",
        zIndex: 1,
        pointerEvents: "none"
      }} />

      {/* Scanline pattern for industrial aesthetic */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
        backgroundSize: "100% 4px, 6px 100%",
        zIndex: 2,
        pointerEvents: "none",
        opacity: 0.4
      }} />

      {/* Hero Content */}
      <div className="animate-fade-up" style={{
        position: "relative",
        zIndex: 3,
        textAlign: "center",
        maxWidth: "800px",
        padding: "0 24px",
        marginTop: "60px"
      }}>
        {/* Dynamic Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(0, 162, 232, 0.08)",
          border: "1px solid rgba(0, 162, 232, 0.2)",
          padding: "6px 16px",
          borderRadius: "9999px",
          marginBottom: "24px",
          boxShadow: "0 0 15px rgba(0, 162, 232, 0.1)"
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", display: "inline-block", boxShadow: "0 0 8px var(--primary)" }}></span>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, color: "var(--primary)" }}>
            Premium Architectural Hardware
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          lineHeight: 1.1,
          marginBottom: "20px",
          color: "var(--white)",
          fontFamily: "var(--font-title)",
          fontWeight: 800
        }}>
          Smart Design. <span className="text-gradient">Solid Performance.</span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-muted)",
          lineHeight: "1.6",
          marginBottom: "36px",
          maxWidth: "640px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          Explore KMI's signature range of door handles, pull handles, mortise locks, and window fittings engineered for style, strength, and security.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px"
        }}>
          <button onClick={scrollToCategories} className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
            Explore Catalogue <ArrowRight size={18} />
          </button>
          
          <a 
            href="https://wa.me/919927755449?text=Hello,%20I%20am%20interested%20in%20KMI%20Architectural%20Hardware%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary" 
            style={{ fontSize: "1rem", padding: "14px 32px" }}
          >
            <MessageSquare size={18} /> Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}
