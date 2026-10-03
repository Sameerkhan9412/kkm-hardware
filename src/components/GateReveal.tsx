"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export default function GateReveal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY;
    // Trigger door opening when user scrolls down
    const threshold = Math.max(30, window.innerHeight / 8);
    if (scrollY > threshold) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient, handleScroll]);

  // Click on door to open smoothly
  const handleDoorClick = () => {
    if (typeof window === "undefined") return;
    if (!isOpen) {
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Scroll track placeholder to provide scroll space */}
      <div
        aria-hidden="true"
        style={{
          height: "90vh",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Main Gate Overlay */}
      <div
        className="gate-reveal-wrapper"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: isOpen ? 1 : 1200,
          pointerEvents: isOpen ? "none" : "auto",
          perspective: "1400px",
          perspectiveOrigin: "center center",
          overflow: "hidden",
          transition: "z-index 0s linear " + (isOpen ? "0.75s" : "0s"),
        }}
      >
        {/* Left Door */}
        <div
          onClick={handleDoorClick}
          className={`door-panel door-left ${isOpen ? "door-open-left" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "50%",
            height: "100vh",
            transformOrigin: "left center",
            transition: "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.75s ease",
            transform: isOpen ? "rotateY(-92deg)" : "rotateY(0deg)",
            zIndex: 10,
            cursor: isOpen ? "default" : "pointer",
            boxShadow: isOpen ? "none" : "15px 0 45px rgba(0,0,0,0.85)",
            borderRight: "1px solid rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/gate-left.png"
            alt="Left Door"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center right",
              display: "block",
            }}
          />
        </div>

        {/* Right Door */}
        <div
          onClick={handleDoorClick}
          className={`door-panel door-right ${isOpen ? "door-open-right" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            width: "50%",
            height: "100vh",
            transformOrigin: "right center",
            transition: "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.75s ease",
            transform: isOpen ? "rotateY(92deg)" : "rotateY(0deg)",
            zIndex: 10,
            cursor: isOpen ? "default" : "pointer",
            boxShadow: isOpen ? "none" : "-15px 0 45px rgba(0,0,0,0.85)",
            borderLeft: "1px solid rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/gate-right.png"
            alt="Right Door"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center left",
              display: "block",
            }}
          />
        </div>

        {/* Floating Scroll Indicator on closed gate */}
        <div
          onClick={handleDoorClick}
          style={{
            position: "fixed",
            bottom: "36px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            opacity: isOpen ? 0 : 1,
            pointerEvents: isOpen ? "none" : "auto",
            transition: "opacity 0.35s ease",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              fontFamily: "var(--font-title)",
              fontWeight: 600,
              background: "rgba(0,0,0,0.65)",
              padding: "7px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              color: "#f8fafc",
            }}
          >
            Scroll to Open Gate
          </span>
          <div style={{ animation: "bounceDown 1.8s infinite" }}>
            <ChevronDown size={24} style={{ color: "#d4af37" }} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounceDown {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(8px);
          }
          60% {
            transform: translateY(4px);
          }
        }
      `}</style>
    </>
  );
}
