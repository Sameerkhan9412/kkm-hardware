"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare, Shield } from "lucide-react";

interface SettingsData {
  companyName: string;
  brandName: string;
  emails: string[];
  phones: string[];
  address: string;
  whatsapp: string;
  brochureLink?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<SettingsData>({
    companyName: "Kumkum Metal Industries",
    brandName: "KMI Architectural Hardware",
    emails: ["kumkummetalindustries@gmail.com", "deepak.kmi@rediffmail.com"],
    phones: ["+91-9927755449", "+91-9927855449"],
    address: "Talanagri Ramghat Road, Aligarh - 202001 (U.P) INDIA",
    whatsapp: "+919927755449",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch((err) => console.error("Error fetching settings for footer:", err));
  }, []);

  const cleanPhone = (phone: string) => {
    return phone.replace(/[^+\d]/g, "");
  };

  return (
    <footer id="contact" style={{
      background: "var(--bg-darker)",
      borderTop: "1px solid rgba(0, 162, 232, 0.08)",
      padding: "60px 24px 30px 24px",
      marginTop: "auto",
      position: "relative",
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "150px",
        background: "radial-gradient(circle, rgba(0, 162, 232, 0.03) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "40px",
        position: "relative",
        zIndex: 1,
        marginBottom: "40px"
      }}>
        {/* Brand Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <svg viewBox="0 0 220 80" width="160" height="58" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 18 V58 M20 38 L42 18 M20 38 L42 58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M52 58 V18 L71 43 L90 18 V58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M104 30 V58" stroke="#00A2E8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="104" cy="16" r="7.5" fill="#00A2E8" />
            <line x1="15" y1="66" x2="200" y2="66" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="15" y1="78" x2="200" y2="78" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
            <text x="107" y="74" fontFamily="'Outfit', sans-serif" fontSize="7.5" fontWeight="600" fill="#f3f4f6" letterSpacing="1" textAnchor="middle">ARCHITECTURAL HARDWARE</text>
          </svg>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
            Smart Design. Solid Performance.<br />
            An ISO Certified Company specializing in premium door handles and locking mechanisms.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <a 
              href={`https://wa.me/${cleanPhone(settings.whatsapp)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-link"
              title="WhatsApp Contact"
            >
              <MessageSquare size={18} />
            </a>
            <a 
              href="https://facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-link"
              title="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a 
              href="https://instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-link"
              title="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        {/* Info Links Column */}
        <div>
          <h4 style={{ color: "var(--white)", fontSize: "1.1rem", marginBottom: "20px", fontFamily: "var(--font-title)" }}>Quick Navigation</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", padding: 0 }}>
            <li>
              <Link href="/" className="footer-link">Home Landing</Link>
            </li>
            <li>
              <a href="#about" className="footer-link">About KMI History</a>
            </li>
            <li>
              <a href="#categories" className="footer-link">Product Showcase</a>
            </li>
            {settings.brochureLink && (
              <li>
                <a href={settings.brochureLink} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: "var(--accent)", fontWeight: 600 }}>Download Brochure</a>
              </li>
            )}
            <li>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 style={{ color: "var(--white)", fontSize: "1.1rem", marginBottom: "20px", fontFamily: "var(--font-title)" }}>Contact Us</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {settings.address}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Phone size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {settings.phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${cleanPhone(phone)}`} className="footer-link" style={{ fontSize: "0.9rem" }}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Mail size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {settings.emails.map((email, idx) => (
                  <a key={idx} href={`mailto:${email}`} className="footer-link" style={{ fontSize: "0.9rem" }}>
                    {email}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "24px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        zIndex: 1
      }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
        </p>
      </div>

      <style jsx global>{`
        .social-icon-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          alignItems: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s;
        }
        .social-icon-link:hover {
          background: var(--primary);
          color: var(--white);
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 162, 232, 0.3);
        }
        .footer-link {
          color: var(--text-muted);
          transition: color 0.2s, padding-left 0.2s;
        }
        .footer-link:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </footer>
  );
}
