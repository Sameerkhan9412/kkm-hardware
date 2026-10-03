"use client";

import { useEffect, useState, useRef } from "react";
import { 
  MessageSquare, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Award,
  Lock
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
    image: "/images/banners/banner-lockset.jpg",
    badge: "STAINLESS STEEL PULL HANDLES LOCK SET",
    model: "KMI PH-2011 6M",
    title1: "Elevate Your",
    title2: "Main Doors.",
    desc: "Complete luxury architectural lock set crafted from premium solid stainless steel with 4 signature finishes: SS, Black Silver, Brass Antique & Matt Black.",
    tags: ["16\" Length", "Complete Set + Keys", "SS 304 Grade", "Main Doors"],
    btnText: "Explore Pull Handles",
    whatsappMsg: "Hello KMI, I am interested in KMI PH-2011 6M Stainless Steel Pull Handles Lock Set.",
    accentColor: "#D4AF37"
  },
  {
    id: 2,
    image: "/images/banners/banner-mortise.jpg",
    badge: "ARCHITECTURAL MORTICE HANDLES",
    model: "KMI MH-1001 Antique",
    title1: "Timeless Craft.",
    title2: "Solid Performance.",
    desc: "Handcrafted mortise handle on plate with classic bevelled curves, ergonomic grip, and lifelong corrosion-resistant Antique Brass finish.",
    tags: ["Antique Brass Finish", "Ergonomic Lever", "ISO Certified", "Precision Plate"],
    btnText: "Explore Mortice Handles",
    whatsappMsg: "Hello KMI, I am interested in KMI MH-1001 Antique Brass Mortice Handles.",
    accentColor: "#D4AF37"
  },
  {
    id: 3,
    image: "/images/banners/banner-pulls.jpg",
    badge: "LUXURY ENTRANCE PULL HANDLES",
    model: "KMI PH-2221 6M Trio",
    title1: "Contemporary Form.",
    title2: "Designer Finishes.",
    desc: "Minimalist capsule curved pull handles available in Brushed Champagne Gold, Satin Stainless Steel, and Deep Matt Black for modern wooden and glass doors.",
    tags: ["Gold • SS • Matt Black", "8\" to 24\" Lengths", "Glass & Wood Doors", "Heavy Solid SS"],
    btnText: "View Pull Handle Trio",
    whatsappMsg: "Hello KMI, I am interested in KMI PH-2221 6M Pull Handles (Gold, SS, Black).",
    accentColor: "#00A2E8"
  },
  {
    id: 4,
    image: "/images/banners/banner-vertibolt.jpg",
    badge: "MAIN DOOR SECURITY LOCKS",
    model: "KMI DL-Verti Bolt Lock",
    title1: "Impenetrable Strength.",
    title2: "Verti-Bolt Protection.",
    desc: "Heavy-duty Zamak and solid brass dual-bolt rim lock with interior solid brass turn knob and high-security ultra brass keys.",
    tags: ["29mm Brass Cylinder", "Dual Solid Bolts", "Indoor & Outdoor", "Heavy Zamak Body"],
    btnText: "View Security Locks",
    whatsappMsg: "Hello KMI, I am interested in KMI DL-Verti Bolt Main Door Lock.",
    accentColor: "#D4AF37"
  },
  {
    id: 5,
    image: "/images/banners/banner-lockbody.jpg",
    badge: "HIGH SECURITY MORTICE LOCK BODY",
    model: "KMI ML-23 Latch Lock",
    title1: "Engineered Security.",
    title2: "Zero Defect Promise.",
    desc: "Heavy-gauge steel body with solid brass reversible roller latch, reinforced deadbolt, and multi-key cylinder tested for 200,000+ cycles.",
    tags: ["3 Ultra Brass Keys", "Reversible Latch", "Tested 200k Cycles", "Anti-Friction"],
    btnText: "Explore Lock Bodies",
    whatsappMsg: "Hello KMI, I am interested in KMI ML-23 High Security Mortice Lock Body.",
    accentColor: "#00A2E8"
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

  // Setup auto scroll interval
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
      {/* Background Ambience Ambient Glow */}
      <div 
        style={{
          position: "absolute",
          top: "30%",
          left: "60%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${slides[current].accentColor === '#00A2E8' ? 'rgba(0, 162, 232, 0.12)' : 'rgba(212, 175, 55, 0.12)'} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          transition: "background 1s ease",
          zIndex: 1
        }}
      />

      {/* Subtle Grid Lines Overlay */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: 
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.7
        }}
      />

      {/* Slides Content */}
      <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 5 }}>
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              style={{
                position: isActive ? "relative" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                minHeight: "100vh",
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s",
                display: "flex",
                alignItems: "center",
                padding: "120px 24px 80px 24px",
              }}
            >
              <div 
                style={{
                  maxWidth: "1280px",
                  width: "100%",
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "48px",
                  alignItems: "center"
                }}
              >
                {/* Left Column: Product Information & Action Hooks */}
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
                    zIndex: 10
                  }}
                >
                  {/* Badge & Model */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                    <div 
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(0, 162, 232, 0.1)",
                        border: "1px solid rgba(0, 162, 232, 0.25)",
                        padding: "5px 14px",
                        borderRadius: "9999px",
                      }}
                    >
                      <Sparkles size={14} style={{ color: "var(--primary)" }} />
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: 700, color: "var(--primary)" }}>
                        {slide.badge}
                      </span>
                    </div>

                    <span 
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#d4af37",
                        background: "rgba(212, 175, 55, 0.1)",
                        border: "1px solid rgba(212, 175, 55, 0.25)",
                        padding: "5px 12px",
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
                      fontSize: "clamp(2.4rem, 5.2vw, 4.2rem)",
                      lineHeight: 1.12,
                      marginBottom: "18px",
                      color: "var(--text-heading)",
                      fontFamily: "var(--font-title)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em"
                    }}
                  >
                    {slide.title1} <span className="text-gradient">{slide.title2}</span>
                  </h1>

                  {/* Description */}
                  <p 
                    style={{
                      fontSize: "clamp(1rem, 1.4vw, 1.18rem)",
                      color: "var(--text)",
                      lineHeight: "1.65",
                      marginBottom: "24px",
                      maxWidth: "560px"
                    }}
                  >
                    {slide.desc}
                  </p>

                  {/* Specification Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                    {slide.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx}
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          background: "var(--card-bg)",
                          border: "1px solid var(--card-border)",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Check size={12} style={{ color: "var(--primary)" }} /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <button 
                      onClick={scrollToCategories} 
                      className="btn btn-primary" 
                      style={{ 
                        fontSize: "0.95rem", 
                        padding: "13px 30px",
                        borderRadius: "9999px",
                        boxShadow: "0 8px 24px rgba(0, 162, 232, 0.35)"
                      }}
                    >
                      {slide.btnText} <ArrowRight size={16} />
                    </button>
                    
                    <a 
                      href={`https://wa.me/919927755449?text=${encodeURIComponent(slide.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary" 
                      style={{ 
                        fontSize: "0.95rem", 
                        padding: "13px 26px",
                        borderRadius: "9999px",
                        border: "1px solid var(--card-border)"
                      }}
                    >
                      <MessageSquare size={16} /> WhatsApp Enquiry
                    </a>
                  </div>
                </div>

                {/* Right Column: Hero Showcase of the Real Company Product Banner */}
                <div 
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0.94)",
                    transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
                  }}
                >
                  {/* Decorative Frame Glow */}
                  <div 
                    style={{
                      position: "absolute",
                      inset: "-12px",
                      borderRadius: "28px",
                      background: `linear-gradient(135deg, ${slide.accentColor === '#00A2E8' ? 'rgba(0, 162, 232, 0.3)' : 'rgba(212, 175, 55, 0.3)'}, transparent 60%)`,
                      filter: "blur(20px)",
                      opacity: 0.6,
                      pointerEvents: "none"
                    }}
                  />

                  {/* Floating Product Showcase Card */}
                  <div 
                    className="glass product-banner-card"
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "540px",
                      borderRadius: "24px",
                      overflow: "hidden",
                      border: "1px solid var(--card-border)",
                      background: "rgba(18, 25, 41, 0.65)",
                      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 35px rgba(0, 162, 232, 0.12)",
                      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease"
                    }}
                  >
                    {/* Top Status Bar on Product Card */}
                    <div 
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--card-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-heading)", letterSpacing: "1px" }}>
                          KMI PRODUCT HIGHLIGHT
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#d4af37", fontWeight: 600 }}>
                        {slide.model}
                      </span>
                    </div>

                    {/* Image Container with high quality presentation */}
                    <div 
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(5,7,10,0.6) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                      }}
                    >
                      <img 
                        src={slide.image}
                        alt={`${slide.badge} - ${slide.model}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "16px",
                          display: "block",
                          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                          filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))"
                        }}
                        className="banner-product-img"
                      />

                      {/* Brand Watermark Emblem */}
                      <div 
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          right: "16px",
                          background: "rgba(9, 13, 22, 0.8)",
                          backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Award size={14} style={{ color: "#d4af37" }} />
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ffffff", letterSpacing: "1px" }}>
                          100% ORIGINAL KMI
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer on card */}
                    <div 
                      style={{
                        padding: "14px 20px",
                        borderTop: "1px solid var(--card-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Architectural Hardware Series
                      </span>
                      <a 
                        href={`https://wa.me/919927755449?text=${encodeURIComponent(slide.whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        Request Quote →
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
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
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(18, 25, 41, 0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--card-border)",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)"
        }}
      >
        <ChevronLeft size={22} />
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
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(18, 25, 41, 0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--card-border)",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)"
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Slide Indicator Pills */}
      <div 
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 20,
          background: "rgba(9, 13, 22, 0.6)",
          backdropFilter: "blur(8px)",
          padding: "8px 16px",
          borderRadius: "9999px",
          border: "1px solid var(--card-border)"
        }}
      >
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === current ? "32px" : "10px",
              height: "10px",
              borderRadius: "9999px",
              background: idx === current ? "var(--primary)" : "rgba(255, 255, 255, 0.2)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: idx === current ? "0 0 10px var(--primary)" : "none"
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        .product-banner-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 35px 75px -15px rgba(0, 0, 0, 0.6), 0 0 45px rgba(0, 162, 232, 0.2) !important;
        }
        .product-banner-card:hover .banner-product-img {
          transform: scale(1.04);
        }
        .slider-nav-btn:hover {
          background: var(--primary) !important;
          color: #ffffff !important;
          border-color: var(--primary) !important;
          transform: translateY(-50%) scale(1.08) !important;
          box-shadow: 0 10px 25px rgba(0, 162, 232, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
