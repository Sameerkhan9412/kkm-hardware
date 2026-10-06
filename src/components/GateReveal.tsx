"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronDown, ShieldCheck, Award, Sparkles, KeyRound } from "lucide-react";

type Stage = "closed" | "welcome" | "entered";

export default function GateReveal() {
  const [stage, setStage] = useState<Stage>("closed");
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cooldownRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
    // If user refreshes while already scrolled down, jump directly to entered state
    if (typeof window !== "undefined" && window.scrollY > 200) {
      setStage("entered");
      window.dispatchEvent(new CustomEvent("kmi-show-header"));
    } else {
      setStage("closed");
      window.dispatchEvent(new CustomEvent("kmi-hide-header"));
    }
  }, []);

  // Manage body scroll locking during gate & welcome presentation
  useEffect(() => {
    if (!isClient) return;

    if (stage === "closed" || stage === "welcome") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else if (stage === "entered") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [stage, isClient]);

  // Stage transition forward helper with cooldown to prevent skip
  const advanceStage = useCallback(() => {
    if (cooldownRef.current) return;

    if (stage === "closed") {
      cooldownRef.current = true;
      setIsAnimating(true);
      setStage("welcome");
      // Keep header hidden during welcome stage
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kmi-hide-header"));
      }
      setTimeout(() => {
        cooldownRef.current = false;
        setIsAnimating(false);
      }, 750);
    } else if (stage === "welcome") {
      cooldownRef.current = true;
      setIsAnimating(true);
      setStage("entered");
      // Reveal header section now!
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kmi-show-header"));
      }
      setTimeout(() => {
        cooldownRef.current = false;
        setIsAnimating(false);
      }, 750);
    }
  }, [stage]);

  // Stage transition backward helper (scroll up)
  const retreatStage = useCallback(() => {
    if (cooldownRef.current) return;

    if (stage === "welcome") {
      cooldownRef.current = true;
      setIsAnimating(true);
      setStage("closed");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("kmi-hide-header"));
      }
      setTimeout(() => {
        cooldownRef.current = false;
        setIsAnimating(false);
      }, 750);
    } else if (stage === "entered" && typeof window !== "undefined" && window.scrollY <= 10) {
      cooldownRef.current = true;
      setIsAnimating(true);
      setStage("welcome");
      window.dispatchEvent(new CustomEvent("kmi-hide-header"));
      setTimeout(() => {
        cooldownRef.current = false;
        setIsAnimating(false);
      }, 750);
    }
  }, [stage]);

  // Handle Wheel Events
  useEffect(() => {
    if (!isClient) return;

    const handleWheel = (e: WheelEvent) => {
      if (stage === "closed") {
        if (e.deltaY > 0) {
          e.preventDefault();
          advanceStage();
        }
      } else if (stage === "welcome") {
        if (e.deltaY > 0) {
          e.preventDefault();
          advanceStage();
        } else if (e.deltaY < -15) {
          e.preventDefault();
          retreatStage();
        }
      } else if (stage === "entered") {
        // If at top of page and user scrolls up with wheel, offer to re-enter gate
        if (window.scrollY <= 0 && e.deltaY < -40) {
          retreatStage();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isClient, stage, advanceStage, retreatStage]);

  // Handle Touch Events (Mobile swipe)
  useEffect(() => {
    if (!isClient) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - touchEndY;
      touchStartRef.current = null;

      // Swiping up (scrolling down)
      if (diff > 35) {
        if (stage === "closed" || stage === "welcome") {
          advanceStage();
        }
      } 
      // Swiping down (scrolling up)
      else if (diff < -35) {
        if (stage === "welcome") {
          retreatStage();
        } else if (stage === "entered" && window.scrollY <= 10) {
          retreatStage();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isClient, stage, advanceStage, retreatStage]);

  // Handle Keyboard Navigation (Arrow keys, Space, PageDown)
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
        if (stage === "closed" || stage === "welcome") {
          e.preventDefault();
          advanceStage();
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        if (stage === "welcome") {
          e.preventDefault();
          retreatStage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClient, stage, advanceStage, retreatStage]);

  const isOpen = stage === "welcome" || stage === "entered";
  const isEntered = stage === "entered";

  return (
    <>
      {/* Main Fullscreen Gate & Welcome Overlay */}
      <div
        className="gate-reveal-wrapper"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: isEntered ? -1 : 1200,
          opacity: isEntered ? 0 : 1,
          pointerEvents: isEntered ? "none" : "auto",
          transition: "opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), z-index 0s linear " + (isEntered ? "0.65s" : "0s"),
          perspective: "1500px",
          perspectiveOrigin: "center center",
          overflow: "hidden",
          background: "#080c14",
        }}
      >
        {/* ============================================================ */}
        {/* INTERIOR FOYER: Welcome Message (Revealed behind open doors) */}
        {/* ============================================================ */}
        <div
          className="welcome-hall-screen"
          onClick={() => {
            if (stage === "welcome") advanceStage();
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 5,
            background: "radial-gradient(circle at 50% 45%, #172554 0%, #090d16 65%, #030712 100%)",
            color: "#ffffff",
            textAlign: "center",
            cursor: stage === "welcome" ? "pointer" : "default",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Ambient Golden Glow Spotlight */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(650px, 90vw)",
              height: "min(650px, 90vw)",
              background: "radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(0, 162, 232, 0.08) 45%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Welcome Content Card */}
          <div
            style={{
              position: "relative",
              maxWidth: "800px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "12px 24px",
            }}
          >
            {/* Official KMI Brand Logo */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(12px)",
                padding: "8px 24px",
                borderRadius: "16px",
                border: "2px solid #d4af37",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(212, 175, 55, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/kmi-logo.png"
                alt="KMI Architectural Hardware"
                style={{
                  height: "44px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            {/* Top Brand Crest */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "9999px",
                background: "rgba(212, 175, 55, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.2)",
              }}
            >
              <Sparkles size={16} style={{ color: "#d4af37" }} />
              <span
                style={{
                  fontSize: "0.82rem",
                  letterSpacing: "3.5px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#d4af37",
                  fontFamily: "var(--font-title)",
                }}
              >
                ✦ WELCOME TO ✦
              </span>
              <Sparkles size={16} style={{ color: "#d4af37" }} />
            </div>

            {/* Main Company Title */}
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: 0,
                color: "#ffffff",
                textShadow: "0 4px 25px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.3)",
                fontFamily: "var(--font-title)",
              }}
            >
              KUMKUM METAL INDUSTRIES
            </h1>

            {/* Sub-Brand Title */}
            <div
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.55rem)",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #fef08a 0%, #d4af37 50%, #ca8a04 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-title)",
              }}
            >
              KMI ARCHITECTURAL HARDWARE
            </div>

            {/* Elegant Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "min(320px, 80%)",
                margin: "4px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.6))" }} />
              <div style={{ width: "8px", height: "8px", transform: "rotate(45deg)", background: "#d4af37" }} />
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(212, 175, 55, 0.6))" }} />
            </div>

            {/* Tagline Description */}
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                color: "#cbd5e1",
                maxWidth: "640px",
                lineHeight: 1.6,
                margin: 0,
                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              Crafting India&apos;s finest luxury mortise handles, high-security door locks, and designer architectural hardware since 2011.
            </p>

            {/* Feature Pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginTop: "8px",
              }}
            >
              {[
                { label: "15+ Years Trust", icon: <Award size={14} /> },
                { label: "500+ Luxury Designs", icon: <Sparkles size={14} /> },
                { label: "ISO Certified Standard", icon: <ShieldCheck size={14} /> },
                { label: "Solid Brass & SS 304", icon: <KeyRound size={14} /> },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "0.82rem",
                    color: "#f1f5f9",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span style={{ color: "#d4af37" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Scroll Indicator to Enter Site */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                advanceStage();
              }}
              style={{
                marginTop: "20px",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(180, 140, 30, 0.95))",
                  color: "#0f172a",
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 30px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <span>Scroll to Enter Showroom</span>
              </div>
              <div style={{ animation: "gateBounce 1.8s infinite" }}>
                <ChevronDown size={24} style={{ color: "#d4af37" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* WHITE DOOR PANELS (Double Door 3D Swing Entrance) */}
        {/* ============================================================ */}
        
        {/* Left White Door */}
        <div
          onClick={() => {
            if (stage === "closed") advanceStage();
          }}
          className={`door-panel door-left ${isOpen ? "door-open-left" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "50%",
            height: "100vh",
            transformOrigin: "left center",
            transition: "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.95s ease",
            transform: isOpen ? "rotateY(-96deg)" : "rotateY(0deg)",
            zIndex: 10,
            cursor: stage === "closed" ? "pointer" : "default",
            boxShadow: isOpen ? "none" : "15px 0 45px rgba(0, 0, 0, 0.35)",
            borderRight: "1px solid rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src="/images/gate-white-left.png"
            alt="Left White Door"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center right",
              display: "block",
            }}
          />
        </div>

        {/* Right White Door */}
        <div
          onClick={() => {
            if (stage === "closed") advanceStage();
          }}
          className={`door-panel door-right ${isOpen ? "door-open-right" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            width: "50%",
            height: "100vh",
            transformOrigin: "right center",
            transition: "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.95s ease",
            transform: isOpen ? "rotateY(96deg)" : "rotateY(0deg)",
            zIndex: 10,
            cursor: stage === "closed" ? "pointer" : "default",
            boxShadow: isOpen ? "none" : "-15px 0 45px rgba(0, 0, 0, 0.35)",
            borderLeft: "1px solid rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src="/images/gate-white-right.png"
            alt="Right White Door"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center left",
              display: "block",
            }}
          />
        </div>

        {/* ============================================================ */}
        {/* LOGO ON ENTRY GATE (Displayed on closed white doors) */}
        {/* ============================================================ */}
        <div
          onClick={() => {
            if (stage === "closed") advanceStage();
          }}
          style={{
            position: "fixed",
            top: "36%",
            left: "50%",
            transform: isOpen ? "translate(-50%, -50%) scale(0.85)" : "translate(-50%, -50%) scale(1)",
            opacity: isOpen ? 0 : 1,
            pointerEvents: isOpen ? "none" : "auto",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            zIndex: 25,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Luxury Crest Plaque with KMI Logo */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(14px)",
              padding: "20px 32px 16px 32px",
              borderRadius: "22px",
              border: "2px solid #d4af37",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.22), 0 0 35px rgba(212, 175, 55, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              minWidth: "220px",
            }}
          >
            {/* Crisp Official Logo */}
            <img
              src="/kmi-logo.png"
              alt="KMI Architectural Hardware"
              style={{
                width: "min(200px, 50vw)",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />

            {/* Golden Divider Line */}
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "linear-gradient(to right, transparent, #d4af37, transparent)",
                margin: "4px 0",
              }}
            />

            {/* Architectural Subtitle */}
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#8b6b23",
                fontWeight: 700,
                fontFamily: "var(--font-title)",
              }}
            >
              ARCHITECTURAL HARDWARE • ESTD. 2011
            </div>
          </div>
        </div>

        {/* Floating Scroll Indicator on closed gate */}
        <div
          onClick={() => {
            if (stage === "closed") advanceStage();
          }}
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
              background: "rgba(15, 23, 42, 0.85)",
              padding: "8px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(212, 175, 55, 0.5)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(212, 175, 55, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#f8fafc",
            }}
          >
            Scroll to Open Gate
          </span>
          <div style={{ animation: "gateBounce 1.8s infinite" }}>
            <ChevronDown size={24} style={{ color: "#d4af37" }} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gateBounce {
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
