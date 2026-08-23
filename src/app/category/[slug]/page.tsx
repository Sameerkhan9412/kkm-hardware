"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  MessageSquare,
  Sparkles,
  ChevronRight
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

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch categories to identify current one and build the sidebar
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success) {
          setAllCategories(catData.data);

          if (slug === "all") {
            setCategory({
              _id: "all",
              name: "All Products",
              slug: "all"
            });
          } else {
            const currentCat = catData.data.find((c: Category) => c.slug === slug);
            if (currentCat) {
              setCategory(currentCat);
            } else {
              // Category not found, redirect to All Products
              router.push("/category/all");
              return;
            }
          }
        }

        // Fetch products (all or filtered by category)
        const prodUrl = slug === "all" ? "/api/products" : `/api/products?category=${slug}`;
        const prodRes = await fetch(prodUrl);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.data);
        }
      } catch (err) {
        console.error("Error loading category page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, router]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWhatsAppLink = (productName: string) => {
    const text = `Hello KMI, I am interested in product *${productName}* under the *${category?.name || ""}* collection. Please share more details and pricing.`;
    return `https://wa.me/919927755449?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{
      minHeight: "90vh",
      padding: "120px 24px 80px 24px",
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative"
    }}>
      {/* Back button */}
      <div style={{ marginBottom: "30px" }}>
        <Link href="/" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem", gap: "4px" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Main Split Layout */}
      <div style={{
        display: "flex",
        gap: "40px",
        alignItems: "flex-start"
      }} className="category-layout">
        
        {/* Left Sidebar Category Filter */}
        <div style={{
          width: "280px",
          flexShrink: 0,
          position: "sticky",
          top: "100px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "10px 0"
        }} className="category-sidebar">
          
          <h3 style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            letterSpacing: "1.5px",
            marginBottom: "8px",
            fontWeight: 700,
            paddingLeft: "8px"
          }}>
            Categories
          </h3>

          {/* All Products Option */}
          <Link
            href="/category/all"
            style={{
              padding: "14px 18px",
              background: slug === "all" ? "var(--primary)" : "rgba(18, 25, 41, 0.4)",
              color: slug === "all" ? "var(--white)" : "var(--text)",
              border: slug === "all" ? "1px solid var(--primary)" : "1px solid var(--card-border)",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "all 0.3s ease"
            }}
            className="sidebar-item glass"
          >
            All Products
          </Link>

          {/* Dynamic Categories */}
          {allCategories.map((cat) => {
            const isActive = cat.slug === slug;
            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                style={{
                  padding: "14px 18px",
                  background: isActive ? "var(--primary)" : "rgba(18, 25, 41, 0.4)",
                  color: isActive ? "var(--white)" : "var(--text)",
                  border: isActive ? "1px solid var(--primary)" : "1px solid var(--card-border)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                className="sidebar-item glass"
              >
                <span style={{ textTransform: "uppercase" }}>{cat.name}</span>
                <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.4 }} />
              </Link>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div style={{ flexGrow: 1, minWidth: 0 }} className="category-content">
          
          {/* Header & Breadcrumb */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,162,232,0.05)", border: "1px solid rgba(0,162,232,0.15)", padding: "4px 12px", borderRadius: "9999px", marginBottom: "12px" }}>
              <Sparkles size={12} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", textTransform: "uppercase" }}>Catalogue</span>
            </div>
            
            <h1 style={{ 
              fontSize: "clamp(2rem, 4vw, 3rem)", 
              color: "var(--white)", 
              margin: 0, 
              textTransform: "uppercase",
              fontFamily: "var(--font-title)"
            }}>
              {category?.name || "Loading Category..."}
            </h1>

            {/* Breadcrumb Path */}
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
              <span>&gt;&gt;</span>
              {slug === "all" ? (
                <span style={{ color: "var(--primary)" }}>All Products</span>
              ) : (
                <>
                  <Link href="/category/all" style={{ color: "var(--text-muted)" }}>All Products</Link>
                  <span>&gt;&gt;</span>
                  <span style={{ color: "var(--primary)" }}>{category?.name || ""}</span>
                </>
              )}
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="glass" style={{
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
            background: "rgba(18, 25, 41, 0.6)",
            border: "1px solid var(--card-border)"
          }}>
            <Search size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search products by model or finish name..."
              className="form-control"
              style={{
                border: "none",
                background: "transparent",
                padding: "6px 0",
                fontSize: "0.95rem",
                margin: 0
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Product List Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
              Loading products in category...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "30px"
            }}>
              {filteredProducts.map((prod) => (
                <div key={prod._id} className="product-card glass" style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(18, 25, 41, 0.4)",
                  transition: "all 0.3s",
                  borderRadius: "12px"
                }}>
                  {/* Product Image Box with elegant light background similar to Cent Hardware design */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "80%", // Aspect ratio 5:4
                    background: "#f1f5f9", // Light background for photorealistic look
                    overflow: "hidden"
                  }}>
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
                        padding: "20px",
                        transition: "transform 0.4s ease"
                      }}
                      className="prod-img"
                    />
                  </div>

                  {/* Content Box */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "12px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--white)", fontWeight: 600, margin: 0 }}>
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
                      <MessageSquare size={14} /> Send Enquiry
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px",
              border: "1px dashed var(--card-border)",
              borderRadius: "12px",
              color: "var(--text-muted)"
            }}>
              {searchQuery ? "No products match your search query." : "No products have been added to this category yet."}
            </div>
          )}
        </div>
      </div>

      {/* Embedded CSS for responsive layout */}
      <style jsx global>{`
        .product-card:hover {
          border-color: var(--primary) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 162, 232, 0.1) !important;
        }
        .product-card:hover .prod-img {
          transform: scale(1.05);
        }
        @media (max-width: 900px) {
          .category-layout {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .category-sidebar {
            width: 100% !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            padding: 4px 0 16px 0 !important;
            position: static !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch;
          }
          .sidebar-item {
            flex-shrink: 0 !important;
            padding: 10px 16px !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
