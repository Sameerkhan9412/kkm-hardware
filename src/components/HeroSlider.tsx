"use client";

import { useEffect, useState, useRef } from "react";
import { 
  MessageSquare, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Award,
  Layers
} from "lucide-react";

interface SlideItem {
  id: number;
  image: string;
  badge: string;
  model: string;
  title1: string;
  title2: string;
  desc: string;
  tags: string[];
  btnText: string;
  whatsappMsg: string;
  accentColor: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    image: "/images/banners/banner-mortise-collection.jpg",
    badge: "ARCHITECTURAL MORTICE HANDLES COLLECTION",
    model: "KMI Royal Elite Series",
    title1: "Timeless Craft.",
    title2: "Enduring Luxury.",
    desc: "Handcrafted solid backplate mortice handles engineered with ergonomic lever profiles. Offered in 5 signature architectural finishes: Antique Brass, Brushed Nickel, Satin Stainless Steel, and Natural Matte.",
    tags: ["5 Finish Variations", "Solid Forged Plate", "Anti-Sag Steel Spring", "ISO 9001 Standard"],
    btnText: "Explore Mortice Handles",
    whatsappMsg: "Hello KMI, I am interested in your Royal Elite Architectural Mortice Handles Collection.",
    accentColor: "#D4AF37"
  },
  {
    id: 2,
    image: "/images/banners/banner-jali-pulls.jpg",
    badge: "HERITAGE LASER-CUT JALI PULL HANDLES",
    model: "KMI Heritage Jali Series",
    title1: "Artistic Intricacy.",
    title2: "Solid Brass Grandeur.",
    desc: "Exquisitely carved entrance pull handles featuring traditional geometric lattice and floral vine jali motifs. Precision CNC-milled from heavy solid brass and premium grade stainless steel.",
    tags: ["Intricate Jali Carving", "Solid Brass & SS 304", "Heavy Door Mount", "Antique Brass & Silver"],
    btnText: "Explore Jali Pull Handles",
    whatsappMsg: "Hello KMI, I am interested in your Heritage Cut-Out Jali Pull Handles Series.",
    accentColor: "#00A2E8"
  },
  {
    id: 3,
    image: "/images/banners/banner-linear-pulls.jpg",
    badge: "CONTEMPORARY LINEAR ENTRANCE PULLS",
    model: "KMI Geometric Line Series",
    title1: "Precision Lines.",
    title2: "Modern Architecture.",
    desc: "Architectural bar pull handles featuring geometric chevron cuts, grooved centerlines, and dual-tone striped end accents. Built for grand wooden entrance doors and frameless glass facades.",
    tags: ["Geometric Inlays", "Dual-Tone Finishes", "12\" to 24\" Lengths", "Heavy Standoff Mounts"],
    btnText: "Explore Modern Pull Handles",
    whatsappMsg: "Hello KMI, I am interested in your Contemporary Linear & Geometric Pull Handles.",
    accentColor: "#D4AF37"
  },
  {
    id: 4,
    image: "/images/banners/banner-geometric-handles.jpg",
    badge: "DESIGNER GREEK KEY & CAPSULE HANDLES",
    model: "KMI Meander & Capsule Trio",
    title1: "Iconic Patterns.",
    title2: "Contemporary Ergonomics.",
    desc: "Statement mortice handles featuring precision-engraved Greek Key (Meander) and Aztec geometric motifs, alongside sleek minimalist rounded capsule plate handles in Antique Brass and Matte Black.",
    tags: ["Greek Key Engraving", "Minimalist Capsule Plate", "Matte Black & Antique Brass", "Universal Reversible"],
    btnText: "Explore Designer Handles",
    whatsappMsg: "Hello KMI, I am interested in your Designer Greek Key & Capsule Mortice Handles.",
    accentColor: "#00A2E8"
  },
  {
    id: 5,
    image: "/images/banners/banner-security-locks.jpg",
    badge: "HIGH SECURITY MAIN DOOR RIM & TRIBOLT LOCKS",
    model: "KMI Maximum Security Suite",
    title1: "Impenetrable Defense.",
    title2: "Uncompromising Safety.",
    desc: "Heavy-duty 3-round bullet Tribolt rim locks, dual-plate heavy tower bolt latches, and Verti-Bolt locks. Engineered with solid brass hardened deadbolts, anti-drill cylinders, and computer keys.",
    tags: ["Tribolt 3-Bullet Deadbolts", "Dual-Plate Rim Latches", "Anti-Pick Dimple Keys", "Tested 200k Cycles"],
    btnText: "Explore Security Locks",
    whatsappMsg: "Hello KMI, I am interested in your High Security Main Door Rim & Tribolt Locks Suite.",
    accentColor: "#D4AF37"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (idx: number) => {
    setCurrent(idx);
  };

  // Setup auto-scroll interval (6 seconds)
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const scrollToCategories = () => {
    const el = document.getElementById("categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--bg-darker)",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* Background Slides with Full-Bleed Product Images */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: isActive ? 1 : 0,
              visibility: isActive ? "visible" : "hidden",
              transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 1.2s",
              zIndex: 1,
              overflow: "hidden"
            }}
          >
            {/* Full-Bleed Product Background Image with gentle Ken-Burns zoom */}
            <img 
              src={slide.image} 
              alt={`${slide.badge} - ${slide.model}`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
                transform: isActive ? "scale(1.05)" : "scale(1.15)",
                transition: "transform 7s cubic-bezier(0.16, 1, 0.3, 1)",
                filter: "brightness(0.92) contrast(1.08)"
              }}
            />

            {/* Left-to-Right Vignette Gradient Overlay so text is perfectly readable */}
            <div 
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.85) 45%, rgba(9, 13, 22, 0.5) 75%, rgba(9, 13, 22, 0.25) 100%)",
                zIndex: 2
              }}
            />

            {/* Top and Bottom Fade Gradients */}
            <div 
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(9, 13, 22, 0.8) 0%, transparent 20%, transparent 75%, rgba(9, 13, 22, 0.98) 100%)",
                zIndex: 3
              }}
            />

            {/* Ambient Accent Radial Glow */}
            <div 
              style={{
                position: "absolute",
                bottom: "10%",
                left: "5%",
                width: "600px",
                height: "600px",
                background: `radial-gradient(circle, ${slide.accentColor === '#00A2E8' ? 'rgba(0, 162, 232, 0.22)' : 'rgba(212, 175, 55, 0.2)'} 0%, transparent 70%)`,
                filter: "blur(80px)",
                pointerEvents: "none",
                zIndex: 4
              }}
            />
          </div>
        );
      })}

      {/* Subtle Texture Grid Overlay */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0.6
        }}
      />

      {/* Foreground Content: Title, Badges, Specs, Buttons */}
      <div 
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "140px 24px 100px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "40px"
        }}
      >
        {/* Left Section: Text Content */}
        <div style={{ maxWidth: "680px", width: "100%" }}>
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            if (!isActive) return null;
            return (
              <div 
                key={slide.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  animation: "fadeInSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}
              >
                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div 
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(0, 162, 232, 0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(0, 162, 232, 0.35)",
                      padding: "6px 16px",
                      borderRadius: "9999px",
                    }}
                  >
                    <Sparkles size={14} style={{ color: "var(--primary)" }} />
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.4px", fontWeight: 700, color: "var(--primary)" }}>
                      {slide.badge}
                    </span>
                  </div>

                  <span 
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#d4af37",
                      background: "rgba(212, 175, 55, 0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(212, 175, 55, 0.35)",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {slide.model}
                  </span>
                </div>

                {/* Headline */}
                <h1 
                  style={{
                    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                    lineHeight: 1.1,
                    marginBottom: "20px",
                    color: "#ffffff",
                    fontFamily: "var(--font-title)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.6)"
                  }}
                >
                  {slide.title1} <span className="text-white">{slide.title2}</span>
                </h1>

                {/* Description */}
                <p 
                  style={{
                    fontSize: "clamp(1.05rem, 1.4vw, 1.22rem)",
                    color: "rgba(255, 255, 255, 0.88)",
                    lineHeight: "1.7",
                    marginBottom: "28px",
                    maxWidth: "600px",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  {slide.desc}
                </p>

                {/* Specification Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
                  {slide.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255, 255, 255, 0.85)",
                        background: "rgba(18, 25, 41, 0.75)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Check size={13} style={{ color: "var(--primary)" }} /> {tag}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  <button 
                    onClick={scrollToCategories} 
                    className="btn btn-primary" 
                    style={{ 
                      fontSize: "1rem", 
                      padding: "14px 32px",
                      borderRadius: "9999px",
                      boxShadow: "0 10px 28px rgba(0, 162, 232, 0.45)"
                    }}
                  >
                    {slide.btnText} <ArrowRight size={17} />
                  </button>
                  
                  <a 
                    href={`https://wa.me/919927755449?text=${encodeURIComponent(slide.whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary" 
                    style={{ 
                      fontSize: "1rem", 
                      padding: "14px 28px",
                      borderRadius: "9999px",
                      background: "rgba(18, 25, 41, 0.65)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.18)"
                    }}
                  >
                    <MessageSquare size={17} /> WhatsApp Enquiry
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section: Floating Watermark & Slide Counter */}
        <div 
          className="hero-floating-badge"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "20px"
          }}
        >
          {/* Active slide counter */}
          <div 
            style={{
              background: "rgba(9, 13, 22, 0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "12px 24px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "baseline",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)", fontFamily: "var(--font-title)" }}>
              0{current + 1}
            </span>
            <span style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.4)", fontWeight: 600 }}>
              / 0{slides.length}
            </span>
          </div>

          {/* Genuine KMI Hardware Emblem */}
          <div 
            style={{
              background: "rgba(9, 13, 22, 0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              padding: "12px 20px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <Award size={18} style={{ color: "#d4af37" }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ffffff", letterSpacing: "1px" }}>
                100% ORIGINAL KMI
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.6)" }}>
                Architectural Quality Standard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="slider-nav-btn"
        aria-label="Previous Slide"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(18, 25, 41, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)"
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextSlide}
        className="slider-nav-btn"
        aria-label="Next Slide"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(18, 25, 41, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)"
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Bottom Slide Indicators with Titles on Hover */}
      <div 
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 20,
          background: "rgba(9, 13, 22, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "10px 20px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.12)"
        }}
      >
        {slides.map((s, idx) => {
          const isCurrent = idx === current;
          return (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.model}`}
              style={{
                width: isCurrent ? "36px" : "10px",
                height: "8px",
                borderRadius: "9999px",
                background: isCurrent ? "var(--primary)" : "rgba(255, 255, 255, 0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isCurrent ? "0 0 12px var(--primary)" : "none"
              }}
            />
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slider-nav-btn:hover {
          background: var(--primary) !important;
          color: #ffffff !important;
          border-color: var(--primary) !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 10px 28px rgba(0, 162, 232, 0.6) !important;
        }
        @media (max-width: 900px) {
          .hero-floating-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
