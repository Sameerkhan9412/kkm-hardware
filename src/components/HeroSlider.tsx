"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SlideItem {
  id: number;
  image: string;
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  btnText: string;
  whatsappMsg: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    image: "/slider-1.jpg",
    badge: "Premium Mortise Handles",
    title1: "Smart Design.",
    title2: "Solid Performance.",
    desc: "Handcrafted architectural fittings engineered with lifelong PVD finishes and premium solid brass.",
    btnText: "Explore Collection",
    whatsappMsg: "Hello KMI, I am interested in your Premium Mortise Handles range."
  },
  {
    id: 2,
    image: "/slider-2.jpg",
    badge: "Grand Entrance Pulls",
    title1: "Stately Aesthetics.",
    title2: "Lifelong Durability.",
    desc: "Exquisite vertical pull handles made of superior Stainless Steel 304 for luxury glass and wooden front doors.",
    btnText: "View Pull Handles",
    whatsappMsg: "Hello KMI, I am interested in your Grand Entrance Pull Handles."
  },
  {
    id: 3,
    image: "/slider-3.jpg",
    badge: "High Security Deadbolts",
    title1: "Maximum Protection.",
    title2: "Multi-Bolt Security.",
    desc: "Rigid multi-bullet lock cylinders designed for high aesthetics and robust residential protection.",
    btnText: "Explore Security Locks",
    whatsappMsg: "Hello KMI, I am interested in your High Security Lock systems."
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
      timerRef.current = setInterval(nextSlide, 5000);
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
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-darker)"
      }}
    >
      {/* Slides Wrapper */}
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}>
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: isActive ? 1 : 0,
                transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: isActive ? 5 : 1,
                pointerEvents: isActive ? "all" : "none"
              }}
            >
              {/* Background Slide Image with overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.05)" : "scale(1.0)",
                transition: "transform 8s ease",
              }} />
              
              {/* Left Shadow overlay & Bottom fade overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right, rgba(9, 13, 22, 0.9) 0%, rgba(9, 13, 22, 0.7) 40%, rgba(9, 13, 22, 0.1) 100%), linear-gradient(to bottom, transparent 60%, var(--bg) 100%)",
                zIndex: 2,
                pointerEvents: "none"
              }} />

              {/* Cyber scanline pattern overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)",
                backgroundSize: "100% 4px",
                zIndex: 3,
                pointerEvents: "none",
                opacity: 0.3
              }} />

              {/* Slide Content */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                zIndex: 4,
                padding: "0 24px"
              }}>
                <div style={{
                  maxWidth: "1200px",
                  width: "100%",
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "40px"
                }}>
                  {/* Left Column Text Content */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(40px)",
                    transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                    maxWidth: "600px"
                  }}>
                    {/* Slide Badge */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(0, 162, 232, 0.1)",
                      border: "1px solid rgba(0, 162, 232, 0.3)",
                      padding: "6px 16px",
                      borderRadius: "9999px",
                      marginBottom: "24px",
                      boxShadow: "0 0 15px rgba(0, 162, 232, 0.1)"
                    }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", display: "inline-block", boxShadow: "0 0 8px var(--primary)" }}></span>
                      <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, color: "var(--primary)" }}>
                        {slide.badge}
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                      fontSize: "clamp(2.3rem, 5vw, 4rem)",
                      lineHeight: 1.15,
                      marginBottom: "20px",
                      color: "var(--white)",
                      fontFamily: "var(--font-title)",
                      fontWeight: 800
                    }}>
                      {slide.title1} <span className="text-gradient">{slide.title2}</span>
                    </h1>

                    {/* Description */}
                    <p style={{
                      fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                      color: "var(--text-muted)",
                      lineHeight: "1.6",
                      marginBottom: "36px"
                    }}>
                      {slide.desc}
                    </p>

                    {/* Buttons */}
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px"
                    }}>
                      <button onClick={scrollToCategories} className="btn btn-primary" style={{ fontSize: "0.95rem", padding: "12px 28px" }}>
                        {slide.btnText} <ArrowRight size={16} />
                      </button>
                      
                      <a 
                        href={`https://wa.me/919927755449?text=${encodeURIComponent(slide.whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary" 
                        style={{ fontSize: "0.95rem", padding: "12px 28px" }}
                      >
                        <MessageSquare size={16} /> Contact Sales
                      </a>
                    </div>
                  </div>
                  
                  {/* Right Column Spacer (To keep text on left and photo context clear on right) */}
                  <div style={{ display: "block" }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Chevrons - Styled similarly to reference image */}
      <button 
        onClick={prevSlide}
        className="slider-nav-btn"
        aria-label="Previous Slide"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(9, 13, 22, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "var(--white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "all 0.3s ease",
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
          zIndex: 10,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(9, 13, 22, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "var(--white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "all 0.3s ease",
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
        zIndex: 10
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: idx === current ? "var(--primary)" : "rgba(255, 255, 255, 0.2)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        ))}
      </div>

      {/* Hover transitions for navigation buttons */}
      <style jsx>{`
        .slider-nav-btn:hover {
          background: var(--primary) !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 15px rgba(0, 162, 232, 0.4);
          transform: translateY(-50%) scale(1.05);
        }
      `}</style>
    </div>
  );
}
