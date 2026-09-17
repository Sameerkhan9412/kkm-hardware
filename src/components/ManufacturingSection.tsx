"use client";

import React from "react";
import { 
  Cpu, 
  Factory, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowUpRight,
  MessageSquare,
  Sparkles
} from "lucide-react";

interface PillarItem {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  icon: React.ReactNode;
  highlights: string[];
}

const PILLARS: PillarItem[] = [
  {
    id: "machinery",
    step: "01",
    title: "State-of-the-Art Machinery",
    badge: "ADVANCED AUTOMATION",
    icon: <Cpu size={20} style={{ color: "var(--primary)" }} />,
    image: "/images/infrastructure/machinery.jpg",
    description:
      "At Kumkum Metal Industries, we continuously invest in modern engineering technology to ensure utmost precision, speed, and structural integrity across every hardware product. Our high-pressure die casting and precision CNC machinery deliver unmatched repeatability and superior surface finish.",
    highlights: [
      "High-pressure zinc & brass die casting units",
      "CNC precision automated milling & tooling",
      "Consistent dimensional accuracy down to microns"
    ]
  },
  {
    id: "manufacturing",
    step: "02",
    title: "In-House Manufacturing",
    badge: "VERTICAL INTEGRATION",
    icon: <Factory size={20} style={{ color: "var(--accent)" }} />,
    image: "/images/infrastructure/manufacturing.jpg",
    description:
      "We believe that complete control over our manufacturing process is the key to delivering unmatched architectural excellence. Every stage—from raw ingot casting, forging, and robotic polishing to final lock assembly—is executed in-house under the vigilant supervision of skilled master technicians.",
    highlights: [
      "100% end-to-end production under one roof",
      "Skilled artisans & master locksmith assemblers",
      "Eco-friendly zero-waste metallurgical handling"
    ]
  },
  {
    id: "quality",
    step: "03",
    title: "Rigorous Quality Assurance",
    badge: "ZERO DEFECT PROMISE",
    icon: <ShieldCheck size={20} style={{ color: "var(--primary)" }} />,
    image: "/images/infrastructure/quality.jpg",
    description:
      "Quality at Kumkum Metal Industries is not just an inspection step—it is our brand promise. Every mortise lock, handle, and architectural fitting is forged from certified high-grade raw alloys and passes thorough multi-point stress, corrosion, and smooth-action tests before packing.",
    highlights: [
      "Spectrometric raw material chemical verification",
      "Multi-layer anti-corrosion salt spray testing",
      "Over 200,000+ cycle endurance lock inspections"
    ]
  },
  {
    id: "logistics",
    step: "04",
    title: "Shipping, Handling & Logistics",
    badge: "NATIONWIDE DISPATCH",
    icon: <Truck size={20} style={{ color: "var(--accent)" }} />,
    image: "/images/infrastructure/logistics.jpg",
    description:
      "We ensure our architectural hardware reaches your showrooms, distribution hubs, and construction projects safely, securely, and always on time. Backed by high-density organized warehousing and trusted logistics partners, every shipment is handled with meticulous care.",
    highlights: [
      "Shock-resistant protective bubble & foam packaging",
      "Organized high-density barcode dispatch system",
      "Seamless express dispatch across all Indian states"
    ]
  }
];

export default function ManufacturingSection() {
  const getWhatsAppEnquiry = (topic: string) => {
    const text = `Hello Kumkum Metal Industries, I am interested in knowing more about your ${topic} and manufacturing capabilities for bulk supply.`;
    return `https://wa.me/919927755449?text=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      id="infrastructure"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(180deg, var(--bg-darker) 0%, var(--bg) 50%, var(--bg-darker) 100%)",
        borderTop: "1px solid var(--card-border)",
        borderBottom: "1px solid var(--card-border)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Subtle background ambient light */}
      <div 
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0, 162, 232, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header: Left Headline + Right Lead Paragraph */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "end",
            marginBottom: "64px"
          }}
        >
          {/* Left Title */}
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
                marginBottom: "18px"
              }}
            >
              <span 
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  boxShadow: "0 0 10px var(--primary)"
                }}
              />
              <span 
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  color: "var(--primary)"
                }}
              >
                INFRASTRUCTURE & EXCELLENCE
              </span>
            </div>

            <h2 
              style={{
                fontSize: "clamp(2.2rem, 4.2vw, 3.1rem)",
                color: "var(--text-heading)",
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                margin: 0
              }}
            >
              Crafting high-quality{" "}
              <span className="text-gradient">architectural hardware</span> with precision, innovation, and trust
            </h2>
          </div>

          {/* Right Lead Description + Key Trust Chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p 
              style={{
                color: "var(--text-muted)",
                fontSize: "1.05rem",
                lineHeight: "1.75",
                margin: 0,
                borderLeft: "3px solid var(--primary)",
                paddingLeft: "18px"
              }}
            >
              <strong style={{ color: "var(--text-heading)" }}>Kumkum Metal Industries</strong> is a premier 
              and trusted manufacturer of Architectural Hardware, based in the renowned hardware capital 
              of <strong>Aligarh (U.P.), India</strong>. With decades of manufacturing heritage and a 
              strict commitment to precision, we engineer architectural mortise handles, locks, and accessories 
              that blend enduring strength, ergonomic elegance, and dependable security.
            </p>

            {/* Quick Strength Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <span className="infra-pill-chip">
                <Sparkles size={14} style={{ color: "var(--accent)" }} /> Aligarh Manufacturing Hub
              </span>
              <span className="infra-pill-chip">
                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} /> ISO Quality Assured
              </span>
              <span className="infra-pill-chip">
                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} /> In-House Tooling & Casting
              </span>
              <span className="infra-pill-chip">
                <Truck size={14} style={{ color: "var(--accent)" }} /> Pan-India Direct Logistics
              </span>
            </div>
          </div>
        </div>

        {/* 2x2 Elevated Grid */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "32px"
          }}
        >
          {PILLARS.map((pillar) => (
            <div 
              key={pillar.id}
              className="glass infra-card"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative"
              }}
            >
              {/* Image Container with Hover Zoom and Overlays */}
              <div 
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  background: "var(--bg-darker)"
                }}
              >
                <img 
                  src={pillar.image} 
                  alt={pillar.title}
                  className="infra-card-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                />

                {/* Subtle dark gradient scrim at bottom of image */}
                <div 
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(15, 23, 42, 0.55) 0%, transparent 50%)",
                    pointerEvents: "none"
                  }}
                />

                {/* Step badge on top left */}
                <div 
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(15, 23, 42, 0.75)",
                    backdropFilter: "blur(8px)",
                    color: "#ffffff",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <span style={{ color: "var(--primary)", fontWeight: 800 }}>{pillar.step}</span>
                  <span>{pillar.badge}</span>
                </div>

                {/* Icon box on bottom right of image */}
                <div 
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(0, 162, 232, 0.2)"
                  }}
                >
                  {pillar.icon}
                </div>
              </div>

              {/* Card Body */}
              <div 
                style={{
                  padding: "26px 26px 28px 26px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: "14px"
                }}
              >
                <h3 
                  style={{
                    fontSize: "1.4rem",
                    color: "var(--text-heading)",
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: "-0.01em"
                  }}
                >
                  {pillar.title}
                </h3>

                <p 
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.96rem",
                    lineHeight: "1.68",
                    margin: 0
                  }}
                >
                  {pillar.description}
                </p>

                {/* Key Checklist Highlights */}
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "6px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(0, 162, 232, 0.08)"
                  }}
                >
                  {pillar.highlights.map((item, i) => (
                    <div 
                      key={i} 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "0.88rem",
                        color: "var(--text)"
                      }}
                    >
                      <CheckCircle2 
                        size={15} 
                        style={{ color: "var(--primary)", flexShrink: 0 }} 
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Direct WhatsApp Action Link */}
                <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                  <a 
                    href={getWhatsAppEnquiry(pillar.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="infra-card-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "var(--primary)",
                      textDecoration: "none"
                    }}
                  >
                    <span>Inquire About {pillar.title}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Inquiry CTA */}
        <div 
          className="glass"
          style={{
            marginTop: "50px",
            padding: "24px 32px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(0, 162, 232, 0.06) 0%, rgba(212, 175, 55, 0.05) 100%)",
            border: "1px solid var(--card-border)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px"
          }}
        >
          <div>
            <h4 
              style={{
                fontSize: "1.15rem",
                color: "var(--text-heading)",
                fontWeight: 700,
                marginBottom: "4px"
              }}
            >
              Looking for OEM / Bulk Architectural Hardware Supply?
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
              Direct factory pricing, custom branded finishes, and dedicated dealership support.
            </p>
          </div>

          <a 
            href="https://wa.me/919927755449?text=Hello%20Kumkum%20Metal%20Industries,%20I%20am%20interested%20in%20visiting%20your%20factory%20or%20placing%20a%20bulk%20dealership%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: "12px 24px",
              fontSize: "0.92rem",
              borderRadius: "9999px",
              boxShadow: "0 6px 20px rgba(0, 162, 232, 0.25)"
            }}
          >
            <MessageSquare size={16} /> Connect with Our Plant Team
          </a>
        </div>
      </div>

      {/* Component Specific CSS for Dynamic Micro-interactions */}
      <style jsx global>{`
        .infra-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary) !important;
          box-shadow: 0 20px 40px -10px rgba(0, 162, 232, 0.18) !important;
        }
        .infra-card:hover .infra-card-image {
          transform: scale(1.06);
        }
        .infra-card-link:hover {
          color: var(--primary-dark) !important;
          text-decoration: underline !important;
        }
        .infra-pill-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text);
        }
      `}</style>
    </section>
  );
}
