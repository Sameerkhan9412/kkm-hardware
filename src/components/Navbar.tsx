"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, MessageSquare, ShieldAlert, Download } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error("Error fetching categories for nav:", err));

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch((err) => console.error("Error fetching settings for nav:", err));
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menus on path change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleScroll = (id: string) => {
    setIsOpen(false);
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="glass" style={{
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      maxWidth: "1200px",
      zIndex: 1000,
      borderRadius: "9999px",
      padding: "8px 24px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      background: "rgba(9, 13, 22, 0.75)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <svg viewBox="0 0 220 80" width="130" height="48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            {/* K */}
            <path d="M20 18 V58 M20 38 L42 18 M20 38 L42 58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* M */}
            <path d="M52 58 V18 L71 43 L90 18 V58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* I */}
            <path d="M104 30 V58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="104" cy="16" r="7.5" fill="#00A2E8" />
            {/* Double lines */}
            <line x1="15" y1="66" x2="200" y2="66" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="15" y1="78" x2="200" y2="78" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
            {/* Subtext */}
            <text x="107" y="74" fontFamily="'Outfit', sans-serif" fontSize="7.5" fontWeight="600" fill="#f3f4f6" letterSpacing="1" textAnchor="middle">ARCHITECTURAL HARDWARE</text>
          </svg>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/" className="nav-item" style={{
            color: pathname === "/" ? "var(--primary)" : "var(--text)",
            fontWeight: 500,
            fontSize: "0.95rem"
          }}>
            Home
          </Link>
          
          <button onClick={() => handleScroll("about")} className="nav-item" style={{
            background: "none",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.95rem"
          }}>
            About Us
          </button>

          {/* Categories Dropdown */}
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="nav-item" 
              style={{
                background: "none",
                border: "none",
                color: "var(--text)",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              Categories <ChevronDown size={14} style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {dropdownOpen && (
              <div 
                onMouseLeave={() => setDropdownOpen(false)}
                className="glass" 
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  minWidth: "240px",
                  maxHeight: "350px",
                  overflowY: "auto",
                  padding: "8px",
                  background: "rgba(9, 13, 22, 0.95)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  zIndex: 1100
                }}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      className="dropdown-item"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: pathname === `/category/${cat.slug}` ? "var(--primary)" : "var(--text)",
                        transition: "all 0.2s",
                        display: "block"
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span style={{ padding: "8px 12px", fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading...</span>
                )}
              </div>
            )}
          </div>

          <button onClick={() => handleScroll("contact")} className="nav-item" style={{
            background: "none",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.95rem"
          }}>
            Contact
          </button>

          {settings?.brochureLink && (
            <a 
              href={settings.brochureLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-item"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Download size={14} /> Brochure
            </a>
          )}

        </div>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/919927755449?text=Hello,%20I%20am%20interested%20in%20KMI%20Architectural%20Hardware%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-whatsapp-desktop"
          style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: "9999px" }}
        >
          <MessageSquare size={14} /> WhatsApp Enquiry
        </a>

        {/* Mobile Toggle */}
        <button className="nav-toggle-mobile" onClick={toggleMenu} style={{
          background: "none",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
          display: "none"
        }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links Overlay */}
      {isOpen && (
        <div className="glass mobile-menu-overlay" style={{
          position: "absolute",
          top: "64px",
          left: "0",
          width: "100%",
          padding: "20px",
          background: "rgba(9, 13, 22, 0.95)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          border: "1px solid var(--card-border)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
          zIndex: 999
        }}>
          <Link href="/" className="mobile-item" onClick={() => setIsOpen(false)}>Home</Link>
          <button onClick={() => handleScroll("about")} className="mobile-item" style={{ background: "none", border: "none", color: "var(--text)", textAlign: "left", fontSize: "1rem" }}>About Us</button>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Categories</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "12px", borderLeft: "2px solid var(--card-border)" }}>
              {categories.map((cat) => (
                <Link key={cat._id} href={`/category/${cat.slug}`} onClick={() => setIsOpen(false)} style={{ fontSize: "0.95rem" }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <button onClick={() => handleScroll("contact")} className="mobile-item" style={{ background: "none", border: "none", color: "var(--text)", textAlign: "left", fontSize: "1rem" }}>Contact</button>
          
          {settings?.brochureLink && (
            <a 
              href={settings.brochureLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-item" 
              onClick={() => setIsOpen(false)}
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Download Brochure
            </a>
          )}
          <a 
            href="https://wa.me/919927755449?text=Hello,%20I%20am%20interested%20in%20KMI%20Architectural%20Hardware%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: "100%", padding: "10px" }}
          >
            <MessageSquare size={16} /> WhatsApp Enquiry
          </a>
        </div>
      )}

      {/* Embedded CSS for responsive navbar items (so we don't have to manage extra files) */}
      <style jsx global>{`
        .nav-item:hover {
          color: var(--primary) !important;
        }
        .dropdown-item:hover {
          background: rgba(0, 162, 232, 0.1) !important;
          color: var(--primary) !important;
          padding-left: 16px !important;
        }
        .mobile-item {
          font-family: var(--font-title);
          font-weight: 500;
          font-size: 1rem;
          color: var(--text);
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .nav-links-desktop, .btn-whatsapp-desktop {
            display: none !important;
          }
          .nav-toggle-mobile {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
