"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, 
  Plus, 
  FolderPlus, 
  Trash2, 
  Edit,
  X,
  PlusCircle,
  Layers,
  Mail,
  Settings as SettingsIcon, 
  Phone, 
  MapPin, 
  MessageSquare,
  Globe,
  Upload,
  ExternalLink,
  ShieldCheck
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

interface SettingsData {
  companyName: string;
  brandName: string;
  emails: string[];
  phones: string[];
  address: string;
  whatsapp: string;
  brochureLink?: string;
  companyVideoUrl?: string;
}

type TabType = "products" | "categories" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    companyName: "",
    brandName: "",
    emails: [],
    phones: [],
    address: "",
    whatsapp: "",
    brochureLink: "",
  });

  // Loading & Status
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Form States - Categories
  const [newCatName, setNewCatName] = useState("");
  const [newCatImageBase64, setNewCatImageBase64] = useState("");

  // Form States - Products
  const [newProdName, setNewProdName] = useState("");
  const [newProdCatId, setNewProdCatId] = useState("");
  const [newProdImageBase64, setNewProdImageBase64] = useState("");

  // Edit States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState("");
  const [editProdCatId, setEditProdCatId] = useState("");
  const [editProdImageBase64, setEditProdImageBase64] = useState("");

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatImageBase64, setEditCatImageBase64] = useState("");

  // Form States - Settings
  const [setCompanyName, setSetCompanyName] = useState("");
  const [setBrandName, setSetBrandName] = useState("");
  const [setAddress, setSetAddress] = useState("");
  const [setWhatsapp, setSetWhatsapp] = useState("");
  const [setBrochureLink, setSetBrochureLink] = useState("");
  const [setCompanyVideoUrl, setSetCompanyVideoUrl] = useState("");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newPhoneInput, setNewPhoneInput] = useState("");
  const [settingsEmails, setSettingsEmails] = useState<string[]>([]);
  const [settingsPhones, setSettingsPhones] = useState<string[]>([]);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes, setRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
        fetch("/api/settings")
      ]);

      const catData = await catRes.json();
      const prodData = await prodRes.json();
      const setData = await setRes.json();

      if (catData.success) setCategories(catData.data);
      if (prodData.success) setProducts(prodData.data);
      if (setData.success && setData.data) {
        const s = setData.data;
        setSettings(s);
        setSetCompanyName(s.companyName || "");
        setSetBrandName(s.brandName || "");
        setSetAddress(s.address || "");
        setSetWhatsapp(s.whatsapp || "");
        setSetBrochureLink(s.brochureLink || "");
        setSetCompanyVideoUrl(s.companyVideoUrl || "");
        setSettingsEmails(s.emails || []);
        setSettingsPhones(s.phones || []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showStatus("Failed to retrieve dashboard configuration.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showStatus = (msg: string, type: "success" | "error") => {
    setStatusMsg(msg);
    setStatusType(type);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setStatusMsg("");
      setStatusType("");
    }, 4000);
  };

  // Auth logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName, image: newCatImageBase64 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Category created successfully!", "success");
        setNewCatName("");
        setNewCatImageBase64("");
        const fileInput = document.getElementById("category-image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        loadData();
      } else {
        showStatus(data.message || "Failed to create category.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Image Upload handler (Base64 conversion)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProdImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Category Image Upload handler (Base64 conversion)
  const handleCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCatImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdCatId) {
      showStatus("Please fill in all product fields.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCatId,
          image: newProdImageBase64
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Product created successfully!", "success");
        setNewProdName("");
        setNewProdCatId("");
        setNewProdImageBase64("");
        const fileInput = document.getElementById("product-image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        loadData();
      } else {
        showStatus(data.message || "Failed to create product.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Product deleted successfully!", "success");
        loadData();
      } else {
        showStatus(data.message || "Failed to delete product.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All products using it will become uncategorized.")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Category deleted successfully!", "success");
        loadData();
      } else {
        showStatus(data.message || "Failed to delete category.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    }
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdCatId(prod.category?._id || "");
    setEditProdImageBase64(prod.image || "");
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim() || !editProdCatId) {
      showStatus("Please fill in name and select category.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct._id,
          name: editProdName,
          category: editProdCatId,
          image: editProdImageBase64,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Product updated successfully!", "success");
        setEditingProduct(null);
        loadData();
      } else {
        showStatus(data.message || "Failed to update product.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProdImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatImageBase64(cat.image || "");
  };

  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) {
      showStatus("Category name is required.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory._id,
          name: editCatName,
          image: editCatImageBase64,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Category updated successfully!", "success");
        setEditingCategory(null);
        loadData();
      } else {
        showStatus(data.message || "Failed to update category.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditCatImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Settings: Add Tag helper
  const handleAddEmail = () => {
    if (newEmailInput.trim() && !settingsEmails.includes(newEmailInput.trim())) {
      setSettingsEmails([...settingsEmails, newEmailInput.trim()]);
      setNewEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setSettingsEmails(settingsEmails.filter((e) => e !== email));
  };

  const handleAddPhone = () => {
    if (newPhoneInput.trim() && !settingsPhones.includes(newPhoneInput.trim())) {
      setSettingsPhones([...settingsPhones, newPhoneInput.trim()]);
      setNewPhoneInput("");
    }
  };

  const handleRemovePhone = (phone: string) => {
    setSettingsPhones(settingsPhones.filter((p) => p !== phone));
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: setCompanyName,
          brandName: setBrandName,
          address: setAddress,
          whatsapp: setWhatsapp,
          emails: settingsEmails,
          phones: settingsPhones,
          brochureLink: setBrochureLink,
          companyVideoUrl: setCompanyVideoUrl
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Company settings updated successfully!", "success");
        loadData();
      } else {
        showStatus(data.message || "Failed to save settings.", "error");
      }
    } catch (err) {
      showStatus("A network error occurred.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "120px 24px 80px 24px",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      {/* Header section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid var(--card-border)",
        paddingBottom: "24px",
        marginBottom: "36px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              background: "rgba(0,162,232,0.1)",
              color: "var(--primary)",
              border: "1px solid rgba(0,162,232,0.2)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
              Control Center
            </span>
          </div>
          <h1 style={{ fontSize: "2.2rem", color: "var(--text-heading)", marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={28} style={{ color: "var(--primary)" }} /> Admin Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/" target="_blank" className="btn btn-secondary" style={{ padding: "10px 20px", fontSize: "0.9rem", gap: "6px" }}>
            Visit Site <ExternalLink size={14} />
          </Link>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "10px 20px", fontSize: "0.9rem", gap: "6px", color: "var(--danger)", borderColor: "var(--danger)" }}>
            Logout <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {statusMsg && (
        <div className={`form-alert form-alert-${statusType}`} style={{ marginBottom: "30px" }}>
          {statusMsg}
        </div>
      )}

      {/* Tab Navigation buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "36px",
        borderBottom: "1px solid var(--card-border)",
        paddingBottom: "12px",
        overflowX: "auto"
      }}>
        {[
          { id: "products", label: "Products Catalog", icon: <PlusCircle size={16} /> },
          { id: "categories", label: "Manage Categories", icon: <Layers size={16} /> },
          { id: "settings", label: "Company Settings", icon: <SettingsIcon size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
            style={{
              padding: "8px 20px",
              fontSize: "0.85rem",
              borderRadius: "9999px",
              flexShrink: 0
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main loading spinner */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
          Loading dashboard content...
        </div>
      ) : (
        <div>
          {/* Tab 1: Products */}
          {activeTab === "products" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "start" }}>
              
              {/* Add Product Form */}
              <div className="glass" style={{ padding: "30px", background: "var(--card-bg)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-heading)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <PlusCircle size={18} style={{ color: "var(--primary)" }} /> Add New Product
                </h3>

                <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="prod-name">Product Name *</label>
                    <input
                      type="text"
                      id="prod-name"
                      required
                      className="form-control"
                      placeholder="e.g. KMI MH-1001 Antique"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="prod-cat">Select Category *</label>
                    <select
                      id="prod-cat"
                      required
                      className="form-control"
                      value={newProdCatId}
                      onChange={(e) => setNewProdCatId(e.target.value)}
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="product-image">Product Image (Optional)</label>
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageUpload}
                      style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                    />
                    <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                      Max size: 2MB. Image will be saved locally inside the database.
                    </small>
                  </div>

                  {newProdImageBase64 && (
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Image Preview:</span>
                      <div style={{ width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px" }}>
                        <img src={newProdImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                    style={{ padding: "12px", borderRadius: "8px", fontSize: "0.9rem", marginTop: "12px" }}
                  >
                    Add Product
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="glass" style={{ padding: "30px", background: "var(--card-bg)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-heading)", marginBottom: "20px" }}>
                  Product List ({products.length})
                </h3>

                {products.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto", paddingRight: "8px" }}>
                    {products.map((prod) => (
                      <div key={prod._id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.02)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "10px",
                        gap: "12px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Image preview thumbnail */}
                          <div style={{ width: "45px", height: "45px", background: "var(--bg-darker)", borderRadius: "6px", overflow: "hidden", flexShrink: 0, padding: "2px" }}>
                            <img 
                              src={prod.image || "/default-lock.png"} 
                              alt={prod.name} 
                              onError={(e) => {
                                e.currentTarget.src = "/default-lock.png";
                              }}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                            />
                          </div>
                          <div>
                            <h4 style={{ fontSize: "0.95rem", color: "var(--text-heading)", fontWeight: 600, margin: 0 }}>
                              {prod.name}
                            </h4>
                            <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                              {prod.category?.name || "Uncategorized"}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="btn"
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              color: "var(--primary)",
                              background: "transparent",
                              border: "1px solid rgba(0, 162, 232, 0.2)"
                            }}
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="btn"
                            style={{
                              padding: "8px",
                              borderRadius: "6px",
                              color: "var(--danger)",
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "40px" }}>
                    No products added yet.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* Tab 2: Categories */}
          {activeTab === "categories" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "start" }}>
              
              {/* Add Category */}
              <div className="glass" style={{ padding: "30px", background: "var(--card-bg)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-heading)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FolderPlus size={18} style={{ color: "var(--primary)" }} /> Add Category
                </h3>

                <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="cat-name">Category Name *</label>
                    <input
                      type="text"
                      id="cat-name"
                      required
                      className="form-control"
                      placeholder="e.g. Cabinet Knobs"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="category-image">Category Image (Optional)</label>
                    <input
                      type="file"
                      id="category-image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleCatImageUpload}
                      style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                    />
                    <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                      Max size: 2MB. Stored locally inside the database.
                    </small>
                  </div>

                  {newCatImageBase64 && (
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Image Preview:</span>
                      <div style={{ width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px" }}>
                        <img src={newCatImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                    style={{ padding: "12px", borderRadius: "8px", fontSize: "0.9rem", marginTop: "12px" }}
                  >
                    Add Category
                  </button>
                </form>
              </div>

              {/* Category list */}
              <div className="glass" style={{ padding: "30px", background: "var(--card-bg)" }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--text-heading)", marginBottom: "20px" }}>
                  Category List ({categories.length})
                </h3>

                {categories.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {categories.map((c) => (
                      <div key={c._id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.02)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        gap: "12px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {/* Image preview thumbnail */}
                          <div style={{ width: "45px", height: "45px", background: "var(--bg-darker)", borderRadius: "6px", overflow: "hidden", flexShrink: 0, padding: "2px" }}>
                            <img 
                              src={c.image || "/default-lock.png"} 
                              alt={c.name} 
                              onError={(e) => {
                                e.currentTarget.src = "/default-lock.png";
                              }}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                            />
                          </div>
                          <div>
                            <h4 style={{ fontSize: "1rem", color: "var(--text-heading)", fontWeight: 600, margin: 0 }}>
                              {c.name}
                            </h4>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Slug: {c.slug}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => startEditCategory(c)}
                            className="btn"
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              background: "rgba(0, 162, 232, 0.1)",
                              color: "var(--primary)",
                              border: "1px solid rgba(0, 162, 232, 0.2)",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c._id)}
                            className="btn"
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "var(--danger)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "40px" }}>
                    No categories found.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* Tab 3: Settings */}
          {activeTab === "settings" && (
            <div className="glass" style={{ padding: "40px", background: "var(--card-bg)" }}>
              <h3 style={{ fontSize: "1.5rem", color: "var(--text-heading)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
                <SettingsIcon size={22} style={{ color: "var(--primary)" }} /> General Contact Configuration
              </h3>

              <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Brand & Company names */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="set-brand">Brand Display Name</label>
                    <input
                      type="text"
                      id="set-brand"
                      className="form-control"
                      value={setBrandName}
                      onChange={(e) => setSetBrandName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="set-company">Manufacturer Legal Name</label>
                    <input
                      type="text"
                      id="set-company"
                      className="form-control"
                      value={setCompanyName}
                      onChange={(e) => setSetCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                {/* WhatsApp & Address */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="set-whatsapp">WhatsApp Contact Number (incl. country code)</label>
                    <input
                      type="text"
                      id="set-whatsapp"
                      className="form-control"
                      value={setWhatsapp}
                      placeholder="e.g. +919927755449"
                      onChange={(e) => setSetWhatsapp(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="set-address">Business Address</label>
                    <input
                      type="text"
                      id="set-address"
                      className="form-control"
                      value={setAddress}
                      onChange={(e) => setSetAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Brochure Link */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label htmlFor="set-brochure" style={{ margin: 0 }}>
                      Catalog Brochure Link (Navbar & Footer)
                    </label>
                    {setBrochureLink && (
                      <a
                        href={setBrochureLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          textDecoration: "underline",
                          fontWeight: 600,
                        }}
                      >
                        ↗ Test Current Link
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    id="set-brochure"
                    className="form-control"
                    placeholder="e.g. https://drive.google.com/file/d/.../view?usp=sharing or PDF URL"
                    value={setBrochureLink}
                    onChange={(e) => setSetBrochureLink(e.target.value)}
                  />
                  <small style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
                    Enter your Google Drive shareable link, Dropbox link, or direct PDF URL. This link is linked directly to the &quot;E-Brochure&quot; buttons in the navbar and footer.
                  </small>
                </div>

                {/* YouTube Company Video (9:16) */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label htmlFor="set-video" style={{ margin: 0 }}>
                      Company Video (YouTube URL - 9:16 Shorts / Vertical Video)
                    </label>
                    {setCompanyVideoUrl && (
                      <a
                        href={setCompanyVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          textDecoration: "underline",
                          fontWeight: 600,
                        }}
                      >
                        ↗ Watch on YouTube
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    id="set-video"
                    className="form-control"
                    placeholder="e.g. https://www.youtube.com/shorts/3jZpE_xxxx or https://youtu.be/xxxx"
                    value={setCompanyVideoUrl}
                    onChange={(e) => setSetCompanyVideoUrl(e.target.value)}
                  />
                  <small style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
                    Upload your 9:16 company video to YouTube (as a YouTube Short or regular video) and paste the link here. It will autoplay automatically on the homepage in 9:16 aspect ratio with muted audio by default.
                  </small>
                </div>

                {/* Dynamic List inputs for Emails & Phones */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
                  
                  {/* Email Section */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", fontWeight: 600 }}>
                      Company Emails
                    </label>
                    
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                      <input
                        type="email"
                        placeholder="Add new email address"
                        className="form-control"
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddEmail();
                          }
                        }}
                      />
                      <button type="button" onClick={handleAddEmail} className="btn btn-secondary" style={{ padding: "10px 16px" }}>
                        Add
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {settingsEmails.map((email, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Mail size={14} style={{ color: "var(--primary)" }} /> {email}
                          </span>
                          <button type="button" onClick={() => handleRemoveEmail(email)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Section */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", fontWeight: 600 }}>
                      Contact Phone Numbers
                    </label>
                    
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                      <input
                        type="text"
                        placeholder="Add new phone number"
                        className="form-control"
                        value={newPhoneInput}
                        onChange={(e) => setNewPhoneInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddPhone();
                          }
                        }}
                      />
                      <button type="button" onClick={handleAddPhone} className="btn btn-secondary" style={{ padding: "10px 16px" }}>
                        Add
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {settingsPhones.map((phone, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.9rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Phone size={14} style={{ color: "var(--primary)" }} /> {phone}
                          </span>
                          <button type="button" onClick={() => handleRemovePhone(phone)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    width: "100%",
                    fontSize: "0.95rem",
                    marginTop: "20px"
                  }}
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div className="glass animate-fade-up" style={{
            padding: "30px",
            background: "var(--bg)",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid var(--primary)",
            position: "relative"
          }}>
            <button
              onClick={() => setEditingProduct(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: "1.4rem", color: "var(--text-heading)", marginBottom: "20px" }}>Edit Product</h3>
            
            <form onSubmit={handleEditProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Category *</label>
                <select
                  required
                  className="form-control"
                  value={editProdCatId}
                  onChange={(e) => setEditProdCatId(e.target.value)}
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Product Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleEditProdImageUpload}
                  style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                />
              </div>

              {editProdImageBase64 && (
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Image Preview:</span>
                  <div style={{ width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px" }}>
                    <img src={editProdImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", fontSize: "0.9rem" }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-secondary"
                  style={{ padding: "12px 20px", borderRadius: "8px", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Edit Modal */}
      {editingCategory && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div className="glass animate-fade-up" style={{
            padding: "30px",
            background: "var(--bg)",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid var(--primary)",
            position: "relative"
          }}>
            <button
              onClick={() => setEditingCategory(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ fontSize: "1.4rem", color: "var(--text-heading)", marginBottom: "20px" }}>Edit Category</h3>
            
            <form onSubmit={handleEditCategorySubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Category Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleEditCatImageUpload}
                  style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                />
              </div>

              {editCatImageBase64 && (
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Image Preview:</span>
                  <div style={{ width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px" }}>
                    <img src={editCatImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", fontSize: "0.9rem" }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="btn btn-secondary"
                  style={{ padding: "12px 20px", borderRadius: "8px", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
