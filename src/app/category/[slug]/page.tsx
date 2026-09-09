"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ShimmerImage from "@/components/ShimmerImage";
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
              background: slug === "all" ? "var(--primary)" : "var(--card-bg)",
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
                  background: isActive ? "var(--primary)" : "var(--card-bg)",
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
              color: "var(--text-heading)", 
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
            background: "var(--card-bg)",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px"
            }}>
              {filteredProducts.map((prod) => {
                const catName = prod.category?.name || category?.name;
                return (
                  <div key={prod._id} className="product-card glass" style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--card-bg)",
                    transition: "all 0.3s",
                    borderRadius: "16px"
                  }}>
                    {/* Product Image Box with full image and shimmer loader */}
                    <div style={{
                      position: "relative",
                      width: "100%",
                      background: "var(--bg-darker)",
                      overflow: "hidden"
                    }}>
                      <ShimmerImage
                        src={prod.image || "/default-lock.png"}
                        alt={prod.name}
                        aspectRatio="4 / 3"
                        padding="10px"
                        className="prod-img"
                      />
                      {/* Category Name Displayed on TOP of the image */}
                      {catName && catName !== "All Products" && (
                        <span style={{
                          position: "absolute",
                          top: "14px",
                          left: "14px",
                          fontSize: "0.72rem",
                          background: "rgba(255, 255, 255, 0.92)",
                          backdropFilter: "blur(6px)",
                          color: "var(--primary)",
                          border: "1px solid rgba(0, 162, 232, 0.25)",
                          padding: "5px 12px",
                          borderRadius: "9999px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          zIndex: 10
                        }}>
                          {catName}
                        </span>
                      )}
                    </div>

                    {/* Content Box */}
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1, gap: "16px", textAlign: "center" }}>
                      <h3 style={{ fontSize: "1.15rem", color: "var(--text-heading)", fontWeight: 600, margin: 0 }}>
                        {prod.name}
                      </h3>
                      
                      <a 
                        href={getWhatsAppLink(prod.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: "0.9rem",
                          borderRadius: "8px",
                          marginTop: "auto"
                        }}
                      >
                        <MessageSquare size={16} /> Send Enquiry
                      </a>
                    </div>
                  </div>
                );
              })}
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
