"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, ShieldCheck, Cpu, Award, MessageSquare, ExternalLink } from "lucide-react";

interface CompanyVideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
}

// Helper to extract YouTube video ID from Shorts, watch?v=, youtu.be, or embed URLs
export function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (shortsMatch) return shortsMatch[1];

  // Standard: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
  if (watchMatch) return watchMatch[1];

  // Short link: youtu.be/VIDEO_ID
  const beMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (beMatch) return beMatch[1];

  // Embed: youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i);
  if (embedMatch) return embedMatch[1];

  return null;
}

export default function CompanyVideoSection({
  videoUrl: propVideoUrl,
  posterUrl = "/slider-1.jpg",
}: CompanyVideoSectionProps) {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(propVideoUrl || "");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch company video URL from settings if not passed as prop
  useEffect(() => {
    if (!propVideoUrl) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.companyVideoUrl) {
            setCurrentVideoUrl(data.data.companyVideoUrl);
          }
        })
        .catch((err) => console.error("Error fetching video settings:", err));
    } else {
      setCurrentVideoUrl(propVideoUrl);
    }
  }, [propVideoUrl]);

  const youtubeId = getYouTubeVideoId(currentVideoUrl);

  // For HTML5 fallback video
  useEffect(() => {
    const video = videoRef.current;
    if (video && !youtubeId) {
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [youtubeId, currentVideoUrl]);

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

  return (
    <section
      id="company-video"
      style={{
        padding: "80px 24px",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-darker) 100%)",
        borderTop: "1px solid var(--card-border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "850px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(0, 162, 232, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Split Section Layout: 9:16 Video Showcase + Manufacturing Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            alignItems: "center",
          }}
          className="video-split-layout"
        >
          {/* Left Column: Narrative & Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0, 162, 232, 0.08)",
                  border: "1px solid rgba(0, 162, 232, 0.25)",
                  padding: "6px 18px",
                  borderRadius: "9999px",
                  marginBottom: "16px",
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
                  fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                  color: "var(--text-heading)",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                }}
              >
                Precision Manufacturing. <span className="text-gradient">In Action.</span>
              </h2>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1.05rem",
                  lineHeight: "1.7",
                }}
              >
                Explore our Aligarh production facility. See how our mortise handles and locks are crafted with high-pressure die casting, robotic polishing, and multi-layer corrosion protection.
              </p>
            </div>

            {/* Feature Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    background: "var(--card-bg)",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0, 162, 232, 0.08)",
                      padding: "8px",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "var(--text-heading)",
                        marginBottom: "2px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick WhatsApp Inquiry Action */}
            <div>
              <a
                href="https://wa.me/919927755449?text=Hello%20KMI,%20I%20watched%20your%20company%20manufacturing%20video%20and%20would%20like%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}
              >
                <MessageSquare size={16} /> Contact Manufacturing Sales
              </a>
            </div>
          </div>

          {/* Right Column: 9:16 Vertical Device Showcase Frame */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "340px",
                aspectRatio: "9 / 16",
                borderRadius: "32px",
                overflow: "hidden",
                border: "3px solid rgba(0, 162, 232, 0.35)",
                boxShadow: "0 25px 50px -12px rgba(0, 162, 232, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                background: "#090d16",
              }}
              className="portrait-video-frame"
            >
              {/* Dynamic Island Header / Top Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(0, 0, 0, 0.75)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                  }}
                />
                KMI Factory • 9:16 Shorts
              </div>

              {/* YouTube 9:16 Video Player (Autoplay & Muted by Default) */}
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&playsinline=1&controls=1&rel=0&modestbranding=1`}
                  title="KMI Company Showcase Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    objectFit: "cover",
                  }}
                />
              ) : currentVideoUrl && (currentVideoUrl.endsWith(".mp4") || currentVideoUrl.endsWith(".webm")) ? (
                /* Fallback direct HTML5 video */
                <>
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
                    <source src={currentVideoUrl} type="video/mp4" />
                  </video>

                  {/* HTML5 Video Controls Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      style={{
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
                    </button>

                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: isMuted ? "rgba(0, 0, 0, 0.65)" : "var(--primary)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      <span>{isMuted ? "Unmute" : "Mute"}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Elegant 9:16 Preview Placeholder when waiting for admin to add YouTube URL */
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    textAlign: "center",
                    background: "linear-gradient(180deg, #090d16 0%, #111827 100%)",
                    color: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(0, 162, 232, 0.15)",
                      border: "2px solid var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <Play size={24} style={{ color: "var(--primary)", marginLeft: "3px" }} />
                  </div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: 700 }}>
                    9:16 Company Video
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5, marginBottom: "16px" }}>
                    Upload your 9:16 video on YouTube and paste the link in the Admin Dashboard under Company Settings.
                  </p>
                  <a
                    href="/admin"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--primary)",
                      textDecoration: "underline",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Admin Dashboard <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .video-split-layout {
            grid-template-columns: 1fr !important;
          }
          .portrait-video-frame {
            max-width: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}
