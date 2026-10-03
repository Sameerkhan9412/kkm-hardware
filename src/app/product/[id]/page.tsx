"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Award, 
  Check, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ChevronRight,
  Maximize2,
  FileText,
  Clock,
  Truck
} from "lucide-react";

interface ProductGalleryItem {
  url: string;
  title?: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  category: Category;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  gallery?: ProductGalleryItem[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          setProduct(data.data);
          setRelated(data.related || []);
        } else {
          // If not found, redirect to all products
          router.push("/category/all");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--text-muted)",
        padding: "120px 24px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "3px solid rgba(0, 162, 232, 0.2)",
          borderTopColor: "var(--primary)",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontSize: "1.05rem" }}>Loading product specifications & images...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Construct gallery list: use product.gallery if exists, or fallback to main image
  const galleryItems: ProductGalleryItem[] = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [
        {
          url: product.image || "/default-lock.png",
          title: `${product.name} - Front View`,
          description: `Primary elevation of ${product.name} manufactured by Kumkum Metal Industries with premium architectural finish.`
        }
      ];

  const currentGalleryItem = galleryItems[activeImageIndex] || galleryItems[0];

  const getWhatsAppLink = () => {
    const text = `Hello KMI Hardware, I am interested in *${product.name}* (Category: ${product.category?.name || "Hardware"}). Please share technical catalogue, price list, and minimum order quantity.`;
    return `https://wa.me/919927755449?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{
      minHeight: "90vh",
      padding: "120px 24px 80px 24px",
      maxWidth: "1280px",
      margin: "0 auto",
      position: "relative"
    }}>
      {/* Top Breadcrumb Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
          <span>/</span>
          <Link href="/category/all" style={{ color: "var(--text-muted)" }}>Products</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} style={{ color: "var(--text-muted)" }}>
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>{product.name}</span>
        </div>

        <Link 
          href={product.category ? `/category/${product.category.slug}` : "/category/all"}
          className="btn btn-secondary" 
          style={{ padding: "8px 16px", fontSize: "0.85rem", gap: "6px", borderRadius: "9999px" }}
        >
          <ArrowLeft size={16} /> Back to {product.category?.name || "Collection"}
        </Link>
      </div>

      {/* Main Two-Column Showcase Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "48px",
        alignItems: "flex-start",
        marginBottom: "70px"
      }}>
        
        {/* Left Column: Interactive Multi-Image Gallery Showcase */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Main Active Image View Card */}
          <div 
            className="glass"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid var(--card-border)",
              background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(9, 13, 22, 0.7) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
            }}
          >
            <img 
              src={currentGalleryItem.url} 
              alt={currentGalleryItem.title || product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "24px",
                display: "block",
                transition: "transform 0.4s ease",
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))"
              }}
            />

            {/* Badge on Image */}
            <div style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              background: "rgba(9, 13, 22, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--card-border)",
              padding: "5px 12px",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <Sparkles size={13} />
              <span>ANGLE {activeImageIndex + 1} OF {galleryItems.length}</span>
            </div>

            {/* Quality Emblem */}
            <div style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              background: "rgba(9, 13, 22, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              padding: "5px 12px",
              borderRadius: "9999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#d4af37",
              letterSpacing: "0.8px"
            }}>
              ORIGINAL KMI HARDWARE
            </div>
          </div>

          {/* Active Image Specific Description Box */}
          <div 
            className="glass" 
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid var(--card-border)",
              background: "rgba(0, 162, 232, 0.04)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }} />
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                {currentGalleryItem.title || `View ${activeImageIndex + 1} Description`}
              </h4>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
              {currentGalleryItem.description || "High-precision architectural hardware engineered by Kumkum Metal Industries."}
            </p>
          </div>

          {/* Thumbnail Strip (if multiple images) */}
          {galleryItems.length > 1 && (
            <div>
              <span style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                color: "var(--text-muted)",
                fontWeight: 700,
                display: "block",
                marginBottom: "10px"
              }}>
                Available Product Views & Angles ({galleryItems.length})
              </span>
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${galleryItems.length}, 1fr)`,
                gap: "12px"
              }}>
                {galleryItems.map((item, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        position: "relative",
                        aspectRatio: "1 / 1",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--card-border)",
                        background: isSelected ? "rgba(0, 162, 232, 0.08)" : "var(--card-bg)",
                        padding: "6px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                        boxShadow: isSelected ? "0 0 15px rgba(0, 162, 232, 0.3)" : "none"
                      }}
                    >
                      <img 
                        src={item.url} 
                        alt={item.title || `Thumbnail ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block"
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Product Overview, Features, Specifications & Action CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Header & Badges */}
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              {product.category && (
                <Link
                  href={`/category/${product.category.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(0, 162, 232, 0.1)",
                    border: "1px solid rgba(0, 162, 232, 0.25)",
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--primary)"
                  }}
                >
                  <Layers size={13} /> {product.category.name}
                </Link>
              )}

              <span style={{
                fontSize: "0.75rem",
                color: "#d4af37",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}>
                MODEL VERIFIED
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              color: "var(--text-heading)",
              lineHeight: 1.15,
              margin: 0,
              fontFamily: "var(--font-title)"
            }}>
              {product.name}
            </h1>
          </div>

          {/* Description */}
          <p style={{
            fontSize: "1.05rem",
            color: "var(--text)",
            lineHeight: 1.7,
            margin: 0
          }}>
            {product.description || "Precision engineered architectural hardware designed for modern residential and commercial entrances. Manufactured in Aligarh by Kumkum Metal Industries with strict quality control and durable surface finishing."}
          </p>

          {/* Key Highlights / Features */}
          {product.features && product.features.length > 0 && (
            <div 
              className="glass" 
              style={{
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid var(--card-border)",
                background: "var(--card-bg)"
              }}
            >
              <h3 style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <ShieldCheck size={18} style={{ color: "var(--primary)" }} /> Product Highlights
              </h3>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                {product.features.map((feature, fIdx) => (
                  <li key={fIdx} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "0.92rem",
                    color: "var(--text)",
                    lineHeight: 1.5
                  }}>
                    <CheckCircle size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "3px" }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Direct CTA Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", paddingTop: "8px" }}>
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                flex: "1 1 240px",
                padding: "14px 28px",
                fontSize: "1rem",
                borderRadius: "9999px",
                boxShadow: "0 8px 24px rgba(0, 162, 232, 0.35)",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <MessageSquare size={18} /> Enquire on WhatsApp
            </a>

            <a 
              href="tel:+919927755449"
              className="btn btn-secondary"
              style={{
                flex: "1 1 180px",
                padding: "14px 24px",
                fontSize: "0.95rem",
                borderRadius: "9999px",
                border: "1px solid var(--card-border)",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Phone size={16} /> +91-9927755449
            </a>
          </div>

          {/* Trust Guarantees Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            paddingTop: "8px",
            borderTop: "1px solid var(--card-border)"
          }}>
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Award size={20} style={{ color: "#d4af37", margin: "0 auto 6px auto" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-heading)" }}>100% Genuine</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Factory Sealed</div>
            </div>
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Clock size={20} style={{ color: "var(--primary)", margin: "0 auto 6px auto" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-heading)" }}>200k Cycles</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Durability Tested</div>
            </div>
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Truck size={20} style={{ color: "var(--primary)", margin: "0 auto 6px auto" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-heading)" }}>Direct Dispatch</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Pan-India Supply</div>
            </div>
          </div>

        </div>
      </div>

      {/* Visual Anatomy & Multiple Images Breakdown Section */}
      <section style={{
        marginBottom: "70px",
        padding: "40px",
        borderRadius: "24px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)"
      }} className="glass">
        
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2.0px", color: "var(--primary)", fontWeight: 700 }}>
            VISUAL ANATOMY & FINISHES
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "var(--text-heading)", marginTop: "6px" }}>
            Multiple Views & Detailed <span className="text-gradient">Descriptions</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "8px auto 0 auto", fontSize: "0.95rem" }}>
            Examine the engineering precision, material quality, and craftsmanship of each component angle.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px"
        }}>
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              className="glass"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid var(--card-border)",
                background: "rgba(9, 13, 22, 0.5)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
            >
              {/* Image Box */}
              <div 
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, rgba(5,7,10,0.8) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  overflow: "hidden"
                }}
              >
                <img 
                  src={item.url} 
                  alt={item.title || `View ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))"
                  }}
                />
                <span style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "rgba(9, 13, 22, 0.85)",
                  backdropFilter: "blur(6px)",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid var(--card-border)"
                }}>
                  VIEW {idx + 1}
                </span>
              </div>

              {/* Description Card Footer */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "10px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "white", margin: 0 }}>
                  {item.title || `Product View ${idx + 1}`}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "white", lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                  {item.description || "Precision architectural hardware finished to international standards."}
                </p>
                <button
                  onClick={() => {
                    setActiveImageIndex(idx);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  style={{
                    alignSelf: "flex-start",
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "8px"
                  }}
                >
                  Inspect in Main Viewer <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products from Same Category */}
      {related.length > 0 && (
        <section>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "36px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2.0px", color: "var(--primary)", fontWeight: 700 }}>
                MORE FROM THIS CATEGORY
              </span>
              <h2 style={{ fontSize: "2rem", color: "var(--text-heading)", marginTop: "4px" }}>
                Related <span className="text-gradient">Products</span>
              </h2>
            </div>
            {product.category && (
              <Link 
                href={`/category/${product.category.slug}`}
                style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                View all in {product.category.name} <ChevronRight size={16} />
              </Link>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            {related.map((rel) => (
              <Link 
                key={rel._id}
                href={`/product/${rel._id}`}
                className="product-card glass"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  background: "var(--bg-darker)",
                  overflow: "hidden"
                }}>
                  <ShimmerImage 
                    src={rel.image || "/default-lock.png"} 
                    alt={rel.name}
                    aspectRatio="4 / 3"
                    padding="12px"
                  />
                </div>
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "8px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>
                    {rel.name}
                  </h3>
                  <div style={{
                    marginTop: "auto",
                    color: "var(--primary)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    View Specifications <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
