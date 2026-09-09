"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Maximize, ShieldCheck, Cpu, Award } from "lucide-react";

interface CompanyVideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
}

export default function CompanyVideoSection({
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-luxury-home-entrance-with-wooden-door-40816-large.mp4",
  posterUrl = "/slider-1.jpg",
}: CompanyVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControlsHint, setShowControlsHint] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true; // Audio disabled by default as required
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Autoplay prevented or video loading:", err);
      });
    }

    // Hide control hint after 5 seconds
    const timer = setTimeout(() => {
      setShowControlsHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error("Error entering fullscreen:", err);
        });
      }
    }
  };

  return (
    <section
      id="company-video"
      style={{
        padding: "70px 24px",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-darker) 100%)",
        borderTop: "1px solid var(--card-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "350px",
          background: "radial-gradient(ellipse, rgba(0, 162, 232, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0, 162, 232, 0.08)",
              border: "1px solid rgba(0, 162, 232, 0.25)",
              padding: "6px 18px",
              borderRadius: "9999px",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--primary)",
                boxShadow: "0 0 10px var(--primary)",
              }}
            />
            <span
              style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1.8px",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              INSIDE KUMKUM METAL INDUSTRIES
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              color: "var(--text-heading)",
              lineHeight: 1.2,
              marginBottom: "12px",
            }}
          >
            Precision Manufacturing. <span className="text-gradient">Timeless Elegance.</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Take a closer look at how our architectural handles and locksets are crafted with state-of-the-art die casting, robotic polishing, and multi-layer corrosion protection.
          </p>
        </div>

        {/* Video Player Card */}
        <div
          ref={containerRef}
          className="glass"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid var(--card-border)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
            background: "#090d16",
          }}
        >
          {/* Reduced Sleek Height Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(240px, 36vw, 400px)",
              overflow: "hidden",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={posterUrl}
              onClick={togglePlay}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>

            {/* Subtle Gradient Overlays for Video Controls Legibility */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.3) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Top Bar Indicators */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                right: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(8px)",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                KMI Factory & Craftsmanship Showcase
              </div>

              {/* Mute status hint */}
              {isMuted && showControlsHint && (
                <div
                  style={{
                    background: "rgba(0, 162, 232, 0.9)",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    animation: "fadeInUp 0.4s ease",
                  }}
                >
                  🔇 Muted by default — click unmute for sound
                </div>
              )}
            </div>

            {/* Floating Interactive Controls at Bottom */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                right: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 10,
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {/* Left Buttons: Play/Pause & Sound Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#ffffff",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  className="video-control-btn"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
                </button>

                {/* Prominent Audio Toggle Button */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: isMuted ? "rgba(0, 0, 0, 0.65)" : "var(--primary)",
                    backdropFilter: "blur(12px)",
                    border: isMuted
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid var(--primary)",
                    color: "#ffffff",
                    padding: "10px 18px",
                    borderRadius: "9999px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  className="video-control-btn"
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={16} />
                      <span>Audio Disabled (Click to Unmute)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={16} />
                      <span>Sound On (Click to Mute)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Button: Fullscreen */}
              <button
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="video-control-btn"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Manufacturing Highlights Grid */}
        <div
          style={{
            maxWidth: "1000px",
            margin: "28px auto 0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: <Cpu size={22} style={{ color: "var(--primary)" }} />,
              title: "High-Pressure Die Casting",
              desc: "Uniform metal density and flawless surfaces engineered for maximum tensile strength.",
            },
            {
              icon: <Award size={22} style={{ color: "var(--accent)" }} />,
              title: "Robotic Polishing & PVD",
              desc: "Multi-layer vacuum deposition for scratch-free, long-lasting metallic finishes.",
            },
            {
              icon: <ShieldCheck size={22} style={{ color: "var(--primary)" }} />,
              title: "Strict 200,000+ Cycle Testing",
              desc: "Every mortise lock and lever handle undergoes rigorous endurance and safety checks.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass"
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                background: "var(--card-bg)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  background: "rgba(0, 162, 232, 0.08)",
                  padding: "10px",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .video-control-btn:hover {
          transform: scale(1.05);
          background: rgba(0, 162, 232, 0.85) !important;
          border-color: var(--primary) !important;
        }
      `}</style>
    </section>
  );
}
