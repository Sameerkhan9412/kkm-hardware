"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { 
  Award, 
  ShieldCheck, 
  Layers, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  category: Category;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }

        // Fetch limited products (8 for homepage)
        const prodRes = await fetch("/api/products?limit=8");
        const prodData = await prodRes.json();
        if (prodData.success) {
          setFeaturedProducts(prodData.data);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getWhatsAppLink = (productName: string) => {
    const text = `Hello KMI, I am interested in your product: *${productName}*. Please share more details and pricing.`;
    return `https://wa.me/919927755449?text=${encodeURIComponent(text)}`;
  };

  // Helper to map category slugs to cool icons
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "steel-mortice-handles":
      case "ss-mortice-handles":
        return <Layers size={24} style={{ color: "var(--primary)" }} />;
      case "mortice-locks":
      case "main-door-lock":
      case "tribolt-lock":
        return <ShieldCheck size={24} style={{ color: "var(--primary)" }} />;
      default:
        return <Award size={24} style={{ color: "var(--primary)" }} />;
    }
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Stats Section */}
      <section style={{
        padding: "60px 24px",
        background: "linear-gradient(to bottom, var(--bg-darker), var(--bg))",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "-100px auto 0 auto", // overlap into hero section
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px"
        }}>
          {[
            { label: "Established In", value: "2011", desc: "15+ Years of Trust" },
            { label: "Design Range", value: "500+", desc: "Exquisite Handcrafts" },
            { label: "Quality Standard", value: "ISO", desc: "Certified Products" },
            { label: "Supply Chain", value: "Global", desc: "Direct Factory Shipping" }
          ].map((stat, i) => (
            <div key={i} className="glass" style={{
              padding: "24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.06)",
              background: "var(--card-bg)",
            }}>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-muted)" }}>
                {stat.label}
              </span>
              <span className="text-gradient" style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-title)" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "60px",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2.0px", color: "var(--primary)", fontWeight: 700 }}>
              OUR LEGACY
            </span>
            <h2 style={{ fontSize: "2.8rem", color: "var(--text-heading)", marginTop: "8px" }}>
              Smart Design. <span className="text-gradient">Solid Performance.</span>
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.7" }}>
            Smart Fit is a synonym of quality. It is a well-known Indian manufacturer of premium hardware products. Established in 2011, it is one of the pioneers in the hardware industry. Headquartered in the UPSIDC Industrial State, Talanagri, Aligarh, Smart Fit hardware is known for its constant innovation and cutting-edge technology.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.7" }}>
            The brand was the vision of a man with big dreams—Shri Krishan Kumar Gupta. Today, his sons have joined the organization with an eternal pursuit of excellence to develop it worldwide, serving architects, interior designers, and luxury homeowners alike.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "12px" }}>
            <span className="badge">✓ ISO 9001 Certified</span>
            <span className="badge">✓ Made in India</span>
            <span className="badge">✓ Premium Finish</span>
          </div>
        </div>

        <div className="glass" style={{ padding: "40px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <h3 style={{ fontSize: "1.5rem", color: "var(--text-heading)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Award style={{ color: "var(--accent)" }} /> KMI Catalogue Includes:
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              "Door Control Series",
              "Rose Handles",
              "SS Mortise Handles",
              "Euro Profile Cylinders",
              "KY & CY Locks",
              "Pull Handles",
              "Main Door Locks",
              "Tribolt Locks",
              "Door Indicator Locks",
              "Fittings Accessories"
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
                <CheckCircle size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span style={{ color: "var(--text)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section id="categories" style={{
        padding: "100px 24px",
        background: "var(--bg-darker)",
        borderTop: "1px solid var(--card-border)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2.0px", color: "var(--primary)", fontWeight: 700 }}>
              OUR PRODUCT CATAGORIES
            </span>
            <h2 style={{ fontSize: "2.8rem", color: "var(--text-heading)", marginTop: "8px" }}>
              Browse by <span className="text-gradient">Collections</span>
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Explore our wide variety of architectural fittings designed to add luxury and security to your spaces.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {categories.map((cat) => (
              <Link 
                key={cat._id} 
                href={`/category/${cat.slug}`}
                className="category-card glass"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  height: "280px",
                  overflow: "hidden",
                  background: "var(--card-bg)",
                }}
              >
                {/* Category Image Cover */}
                <div style={{
                  width: "100%",
                  height: "160px",
                  position: "relative",
                  background: "var(--bg-darker)",
                  overflow: "hidden",
                  borderBottom: "1px solid var(--card-border)"
                }}>
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      onError={(e) => {
                        e.currentTarget.src = "/default-lock.png";
                      }}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        transition: "transform 0.5s ease"
                      }}
                      className="cat-card-img"
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(0, 162, 232, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        background: "rgba(0, 162, 232, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(0, 162, 232, 0.15)"
                      }}>
                        {getCategoryIcon(cat.slug)}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Card Content info */}
                <div style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  gap: "8px"
                }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--text-heading)", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>{cat.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>Browse collection</p>
                  </div>
                  <div style={{
                    alignSelf: "flex-end",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}>
                    Explore <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "60px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2.0px", color: "var(--primary)", fontWeight: 700 }}>
              FEATURED DESIGNS
            </span>
            <h2 style={{ fontSize: "2.8rem", color: "var(--text-heading)", marginTop: "8px" }}>
              Signature <span className="text-gradient">Products</span>
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", maxWidth: "450px" }}>
            A limited selection of our premium mortise handles, locks, and pull handles featured in our 2026 catalogue.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
            Loading products catalog...
          </div>
        ) : featuredProducts.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "30px"
          }}>
            {featuredProducts.map((prod) => (
              <div key={prod._id} className="product-card glass" style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                background: "var(--card-bg)",
                transition: "all 0.3s"
              }}>
                {/* Product Image Box */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "80%", // Aspect ratio 5:4
                  background: "var(--bg-darker)",
                  overflow: "hidden"
                }}>
                  {/* Base64 Image */}
                  <img
                    src={prod.image || "/default-lock.png"}
                    alt={prod.name}
                    onError={(e) => {
                      e.currentTarget.src = "/default-lock.png";
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "16px",
                      transition: "transform 0.4s ease"
                    }}
                    className="prod-img"
                  />
                  {prod.category && (
                    <span style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      fontSize: "0.7rem",
                      background: "rgba(0, 162, 232, 0.15)",
                      color: "var(--primary)",
                      border: "1px solid rgba(0, 162, 232, 0.25)",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {prod.category.name}
                    </span>
                  )}
                </div>

                {/* Content Box */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "16px" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--text-heading)", fontWeight: 600, margin: 0 }}>
                    {prod.name}
                  </h3>
                  
                  <a 
                    href={getWhatsAppLink(prod.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.85rem",
                      borderRadius: "8px",
                      marginTop: "auto"
                    }}
                  >
                    <MessageSquare size={14} /> Send WhatsApp Enquiry
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "40px",
            border: "1px dashed var(--card-border)",
            borderRadius: "12px",
            color: "var(--text-muted)"
          }}>
            No products found. Please use the Admin panel to insert products.
          </div>
        )}
      </section>

      {/* Quality Trust Banner */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(to right, rgba(0, 162, 232, 0.03) 0%, rgba(212, 175, 55, 0.02) 100%)",
        borderTop: "1px solid var(--card-border)",
        borderBottom: "1px solid var(--card-border)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px"
        }}>
          {[
            { title: "Premium Finishes", desc: "Corrosion resistant coatings in Antique Brass, Satin Chrome, Matt Black, PVD Rose Gold and PVD Gold.", icon: <Award size={36} style={{ color: "var(--accent)" }} /> },
            { title: "100% Solid Materials", desc: "Engineered with heavy-grade brass and superior rust-free Stainless Steel 304 for lifelong durability.", icon: <Layers size={36} style={{ color: "var(--primary)" }} /> },
            { title: "Reliability & Safety", desc: "Each mortise lock undergoes rigorous cycle tests ensuring maximum protection, strength and security.", icon: <ShieldCheck size={36} style={{ color: "var(--primary)" }} /> }
          ].map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ color: "var(--text-heading)", fontSize: "1.2rem", marginBottom: "8px", fontWeight: 600 }}>{item.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.5" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Embed local styling for page interactions */}
      <style jsx global>{`
        .badge {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .category-card:hover {
          border-color: var(--primary) !important;
          box-shadow: 0 12px 30px rgba(0, 162, 232, 0.15) !important;
        }
        .category-card:hover .cat-card-img {
          transform: scale(1.05);
        }
        .product-card:hover {
          border-color: var(--primary) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 162, 232, 0.1) !important;
        }
        .product-card:hover .prod-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
