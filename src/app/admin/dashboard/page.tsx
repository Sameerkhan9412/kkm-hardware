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
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Eye,
  Image as ImageIcon
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface ProductGalleryItem {
  url: string;
  title?: string;
  description?: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  category: Category;
  description?: string;
  features?: string[];
  gallery?: ProductGalleryItem[];
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
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdFeatures, setNewProdFeatures] = useState<string[]>([]);
  const [newProdFeatureInput, setNewProdFeatureInput] = useState("");
  const [newProdGallery, setNewProdGallery] = useState<ProductGalleryItem[]>([]);
  const [showAdvancedNewProd, setShowAdvancedNewProd] = useState(false);

  // Edit States - Products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState("");
  const [editProdCatId, setEditProdCatId] = useState("");
  const [editProdImageBase64, setEditProdImageBase64] = useState("");
  const [editProdDescription, setEditProdDescription] = useState("");
  const [editProdFeatures, setEditProdFeatures] = useState<string[]>([]);
  const [editProdFeatureInput, setEditProdFeatureInput] = useState("");
  const [editProdGallery, setEditProdGallery] = useState<ProductGalleryItem[]>([]);

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

  // Features helpers for New Product
  const handleAddFeatureNew = () => {
    if (newProdFeatureInput.trim() && !newProdFeatures.includes(newProdFeatureInput.trim())) {
      setNewProdFeatures([...newProdFeatures, newProdFeatureInput.trim()]);
      setNewProdFeatureInput("");
    }
  };

  const handleRemoveFeatureNew = (index: number) => {
    setNewProdFeatures(newProdFeatures.filter((_, idx) => idx !== index));
  };

  // Gallery helpers for New Product
  const handleAddGalleryItemNew = () => {
    setNewProdGallery([
      ...newProdGallery,
      {
        url: "",
        title: `Angle ${newProdGallery.length + 1} - View`,
        description: ""
      }
    ]);
  };

  const handleRemoveGalleryItemNew = (index: number) => {
    setNewProdGallery(newProdGallery.filter((_, idx) => idx !== index));
  };

  const handleGalleryItemChangeNew = (index: number, field: "title" | "description", value: string) => {
    const updated = [...newProdGallery];
    updated[index] = { ...updated[index], [field]: value };
    setNewProdGallery(updated);
  };

  const handleGalleryImageUploadNew = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...newProdGallery];
      updated[index] = { ...updated[index], url: reader.result as string };
      setNewProdGallery(updated);
    };
    reader.readAsDataURL(file);
  };

  // Features helpers for Edit Product
  const handleAddFeatureEdit = () => {
    if (editProdFeatureInput.trim() && !editProdFeatures.includes(editProdFeatureInput.trim())) {
      setEditProdFeatures([...editProdFeatures, editProdFeatureInput.trim()]);
      setEditProdFeatureInput("");
    }
  };

  const handleRemoveFeatureEdit = (index: number) => {
    setEditProdFeatures(editProdFeatures.filter((_, idx) => idx !== index));
  };

  // Gallery helpers for Edit Product
  const handleAddGalleryItemEdit = () => {
    setEditProdGallery([
      ...editProdGallery,
      {
        url: "",
        title: `Angle ${editProdGallery.length + 1} - View`,
        description: ""
      }
    ]);
  };

  const handleRemoveGalleryItemEdit = (index: number) => {
    setEditProdGallery(editProdGallery.filter((_, idx) => idx !== index));
  };

  const handleGalleryItemChangeEdit = (index: number, field: "title" | "description", value: string) => {
    const updated = [...editProdGallery];
    updated[index] = { ...updated[index], [field]: value };
    setEditProdGallery(updated);
  };

  const handleGalleryImageUploadEdit = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus("File size is too large. Limit is 2MB.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...editProdGallery];
      updated[index] = { ...updated[index], url: reader.result as string };
      setEditProdGallery(updated);
    };
    reader.readAsDataURL(file);
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdCatId) {
      showStatus("Please fill in product name and select category.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const validGallery = newProdGallery.filter(item => item.url && item.url.trim() !== "");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCatId,
          image: newProdImageBase64,
          description: newProdDescription,
          features: newProdFeatures,
          gallery: validGallery
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Product created successfully with detail page content!", "success");
        setNewProdName("");
        setNewProdCatId("");
        setNewProdImageBase64("");
        setNewProdDescription("");
        setNewProdFeatures([]);
        setNewProdFeatureInput("");
        setNewProdGallery([]);
        setShowAdvancedNewProd(false);
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
    setEditProdName(prod.name || "");
    setEditProdCatId(prod.category?._id || "");
    setEditProdImageBase64(prod.image || "");
    setEditProdDescription(prod.description || "");
    setEditProdFeatures(prod.features ? [...prod.features] : []);
    setEditProdFeatureInput("");
    setEditProdGallery(prod.gallery ? JSON.parse(JSON.stringify(prod.gallery)) : []);
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim() || !editProdCatId) {
      showStatus("Please fill in product name and select category.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const validGallery = editProdGallery.filter(item => item.url && item.url.trim() !== "");
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct._id,
          name: editProdName,
          category: editProdCatId,
          image: editProdImageBase64,
          description: editProdDescription,
          features: editProdFeatures,
          gallery: validGallery
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showStatus("Product and dynamic page details updated successfully!", "success");
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
                    <label htmlFor="product-image">Primary Product Elevation Image (Optional)</label>
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageUpload}
                      style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                    />
                    <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                      Max size: 2MB. Stored locally or via Cloudinary.
                    </small>
                  </div>

                  {newProdImageBase64 && (
                    <div style={{ marginTop: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Primary Preview:</span>
                      <div style={{ width: "120px", height: "90px", borderRadius: "8px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px" }}>
                        <img src={newProdImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  {/* Toggle Advanced / Dynamic Page Fields */}
                  <div style={{
                    marginTop: "6px",
                    padding: "12px",
                    background: "rgba(0, 162, 232, 0.05)",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 162, 232, 0.15)"
                  }}>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedNewProd(!showAdvancedNewProd)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: 0,
                        width: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sparkles size={15} /> 
                        {showAdvancedNewProd ? "Hide Page Details & Gallery" : "+ Configure Detail Page & Gallery (Optional)"}
                      </span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                        {showAdvancedNewProd ? "▲ Collapse" : "▼ Expand"}
                      </span>
                    </button>

                    {showAdvancedNewProd && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "14px" }}>
                        {/* Description */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.85rem" }}>Product Detailed Overview</label>
                          <textarea
                            rows={3}
                            className="form-control"
                            placeholder="Write comprehensive product description for /product/[id]..."
                            value={newProdDescription}
                            onChange={(e) => setNewProdDescription(e.target.value)}
                            style={{ fontSize: "0.85rem" }}
                          />
                        </div>

                        {/* Product Highlights */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.85rem" }}>Key Highlights / Features</label>
                          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                            <input
                              type="text"
                              placeholder="e.g. Forged from solid virgin brass"
                              className="form-control"
                              value={newProdFeatureInput}
                              onChange={(e) => setNewProdFeatureInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddFeatureNew();
                                }
                              }}
                              style={{ fontSize: "0.85rem" }}
                            />
                            <button
                              type="button"
                              onClick={handleAddFeatureNew}
                              className="btn btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "0.8rem", flexShrink: 0 }}
                            >
                              Add
                            </button>
                          </div>
                          {newProdFeatures.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {newProdFeatures.map((f, fIdx) => (
                                <span key={fIdx} style={{
                                  fontSize: "0.75rem",
                                  background: "rgba(255,255,255,0.05)",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid var(--card-border)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}>
                                  <CheckCircle size={12} style={{ color: "var(--primary)" }} /> {f}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeatureNew(fIdx)}
                                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: 0 }}
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Multi-Angle Gallery */}
                        <div className="form-group" style={{ margin: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <label style={{ fontSize: "0.85rem", margin: 0 }}>
                              Multi-Angle Gallery ({newProdGallery.length})
                            </label>
                            <button
                              type="button"
                              onClick={handleAddGalleryItemNew}
                              className="btn btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "0.75rem", gap: "4px" }}
                            >
                              <Plus size={12} /> Add View
                            </button>
                          </div>

                          {newProdGallery.map((item, gIdx) => (
                            <div key={gIdx} style={{
                              padding: "10px",
                              background: "rgba(0,0,0,0.2)",
                              borderRadius: "8px",
                              border: "1px solid var(--card-border)",
                              marginBottom: "8px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                                  VIEW #{gIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryItemNew(gIdx)}
                                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGalleryImageUploadNew(gIdx, e)}
                                style={{ fontSize: "0.75rem" }}
                              />
                              {item.url && (
                                <img src={item.url} alt="view preview" style={{ width: "60px", height: "45px", objectFit: "contain", background: "black", borderRadius: "4px" }} />
                              )}
                              <input
                                type="text"
                                placeholder="View Title (e.g. Front Elevation)"
                                value={item.title || ""}
                                onChange={(e) => handleGalleryItemChangeNew(gIdx, "title", e.target.value)}
                                className="form-control"
                                style={{ fontSize: "0.8rem", padding: "6px 8px" }}
                              />
                              <textarea
                                rows={2}
                                placeholder="View Description / details..."
                                value={item.description || ""}
                                onChange={(e) => handleGalleryItemChangeNew(gIdx, "description", e.target.value)}
                                className="form-control"
                                style={{ fontSize: "0.8rem", padding: "6px 8px" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

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
                  Product Catalog ({products.length})
                </h3>

                {products.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "650px", overflowY: "auto", paddingRight: "8px" }}>
                    {products.map((prod) => (
                      <div key={prod._id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        background: "rgba(0,0,0,0.02)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "12px",
                        gap: "12px",
                        flexWrap: "wrap"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: "1 1 240px" }}>
                          {/* Image preview thumbnail */}
                          <div style={{ width: "52px", height: "52px", background: "var(--bg-darker)", borderRadius: "8px", overflow: "hidden", flexShrink: 0, padding: "3px", border: "1px solid var(--card-border)" }}>
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
                            <h4 style={{ fontSize: "0.98rem", color: "var(--text-heading)", fontWeight: 600, margin: 0 }}>
                              {prod.name}
                            </h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
                                {prod.category?.name || "Uncategorized"}
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "9999px", border: "1px solid var(--card-border)" }}>
                                📷 {prod.gallery?.length || 0} Views
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "9999px", border: "1px solid var(--card-border)" }}>
                                ✨ {prod.features?.length || 0} Highlights
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                          <Link
                            id={`live-page-link-${prod._id}`}
                            href={`/product/${prod._id}`}
                            target="_blank"
                            className="btn btn-secondary"
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.78rem",
                              borderRadius: "8px",
                              gap: "4px",
                              color: "var(--primary)",
                              borderColor: "rgba(0, 162, 232, 0.3)"
                            }}
                            title="Open Customer-Facing Live Page in new tab"
                          >
                            <ExternalLink size={13} /> Live Page
                          </Link>

                          <button
                            id={`edit-prod-btn-${prod._id}`}
                            onClick={() => startEditProduct(prod)}
                            className="btn btn-primary"
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.78rem",
                              borderRadius: "8px",
                              gap: "4px"
                            }}
                            title="Edit Product Details, Content & Gallery"
                          >
                            <Edit size={13} /> Edit Details
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="btn"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              color: "var(--danger)",
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
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
          background: "rgba(10, 15, 26, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "20px"
        }}>
          <div className="glass animate-fade-up" style={{
            padding: "32px",
            background: "var(--bg)",
            maxWidth: "920px",
            width: "100%",
            maxHeight: "92vh",
            overflowY: "auto",
            borderRadius: "20px",
            border: "1px solid rgba(0, 162, 232, 0.4)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            position: "relative"
          }}>
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid var(--card-border)",
              paddingBottom: "16px",
              marginBottom: "24px",
              gap: "16px",
              flexWrap: "wrap"
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{
                    fontSize: "0.72rem",
                    color: "var(--primary)",
                    background: "rgba(0, 162, 232, 0.1)",
                    border: "1px solid rgba(0, 162, 232, 0.25)",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    textTransform: "uppercase"
                  }}>
                    DYNAMIC PAGE BUILDER
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    ID: {editingProduct._id}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.45rem", color: "var(--text-heading)", margin: 0, fontWeight: 700 }}>
                  Edit Product & Page Content: <span className="text-gradient">{editingProduct.name}</span>
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Configure all dynamic information rendered at <code>/product/{editingProduct._id}</code>.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href={`/product/${editingProduct._id}`}
                  target="_blank"
                  className="btn btn-secondary"
                  style={{
                    padding: "8px 14px",
                    fontSize: "0.82rem",
                    borderRadius: "9999px",
                    gap: "6px",
                    color: "var(--primary)",
                    borderColor: "rgba(0, 162, 232, 0.35)"
                  }}
                  title="Preview live customer-facing page"
                >
                  <ExternalLink size={14} /> View Live Page ↗
                </Link>

                <button
                  id="modal-close-btn"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* SECTION 1: Core Product Info */}
              <div style={{
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--card-border)",
                borderRadius: "14px"
              }}>
                <h4 style={{ fontSize: "1.05rem", color: "var(--text-heading)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={18} style={{ color: "var(--primary)" }} /> 1. Core Identification
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Product Name *</label>
                    <input
                      id="modal-product-name"
                      type="text"
                      required
                      className="form-control"
                      value={editProdName}
                      onChange={(e) => setEditProdName(e.target.value)}
                      placeholder="e.g. KMI MH-1001 Antique Mortise Handle"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Category *</label>
                    <select
                      id="modal-product-category"
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
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label style={{ fontSize: "0.88rem", display: "block", marginBottom: "6px" }}>Primary Elevation / Front Thumbnail Image</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    {editProdImageBase64 ? (
                      <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", background: "var(--bg-darker)", border: "1px solid var(--card-border)", padding: "4px", flexShrink: 0 }}>
                        <img src={editProdImageBase64} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    ) : (
                      <div style={{ width: "80px", height: "80px", borderRadius: "10px", background: "var(--bg-darker)", border: "1px dashed var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.75rem", flexShrink: 0 }}>
                        No Image
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleEditProdImageUpload}
                        style={{ padding: "8px 12px", border: "1px dashed var(--card-border)" }}
                      />
                      <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                        Main display thumbnail for catalog and default view. Max 2MB.
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Comprehensive Product Description */}
              <div style={{
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--card-border)",
                borderRadius: "14px"
              }}>
                <h4 style={{ fontSize: "1.05rem", color: "var(--text-heading)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={18} style={{ color: "var(--primary)" }} /> 2. Product Overview & Description
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                  This text appears prominently right under the product title on the product detail page.
                </p>

                <div className="form-group" style={{ margin: 0 }}>
                  <textarea
                    id="modal-product-desc"
                    rows={4}
                    className="form-control"
                    placeholder="Enter comprehensive description about this product, material composition, finishes, recommended door thickness, and residential/commercial use cases..."
                    value={editProdDescription}
                    onChange={(e) => setEditProdDescription(e.target.value)}
                    style={{ lineHeight: 1.6 }}
                  />
                </div>
              </div>

              {/* SECTION 3: Key Highlights & Features */}
              <div style={{
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--card-border)",
                borderRadius: "14px"
              }}>
                <h4 style={{ fontSize: "1.05rem", color: "var(--text-heading)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={18} style={{ color: "var(--primary)" }} /> 3. Product Highlights & Key Points
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                  Displayed in the dedicated "Product Highlights" section on the detail page with checkmark badges.
                </p>

                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    id="modal-highlight-input"
                    type="text"
                    placeholder="e.g. Tested for 200,000 cycles with zero spring fatigue"
                    className="form-control"
                    value={editProdFeatureInput}
                    onChange={(e) => setEditProdFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeatureEdit();
                      }
                    }}
                  />
                  <button
                    id="modal-add-highlight-btn"
                    type="button"
                    onClick={handleAddFeatureEdit}
                    className="btn btn-secondary"
                    style={{ padding: "10px 18px", flexShrink: 0 }}
                  >
                    Add Highlight
                  </button>
                </div>

                {editProdFeatures.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {editProdFeatures.map((feat, fIdx) => (
                      <div key={fIdx} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 14px",
                        background: "rgba(0, 162, 232, 0.06)",
                        border: "1px solid rgba(0, 162, 232, 0.2)",
                        borderRadius: "8px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "var(--text)" }}>
                          <CheckCircle size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureEdit(fIdx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          title="Remove Highlight"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                    No custom highlights added yet. Type a bullet point above and click "Add Highlight".
                  </p>
                )}
              </div>

              {/* SECTION 4: Visual Anatomy & Multi-Angle Gallery */}
              <div style={{
                padding: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--card-border)",
                borderRadius: "14px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                  flexWrap: "wrap",
                  gap: "10px"
                }}>
                  <h4 style={{ fontSize: "1.05rem", color: "var(--text-heading)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <ImageIcon size={18} style={{ color: "var(--primary)" }} /> 4. Multiple Images & Angle Breakdown ({editProdGallery.length} Views)
                  </h4>

                  <button
                    id="modal-add-angle-btn"
                    type="button"
                    onClick={handleAddGalleryItemEdit}
                    className="btn btn-secondary"
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.82rem",
                      borderRadius: "9999px",
                      gap: "6px",
                      color: "var(--primary)",
                      borderColor: "rgba(0, 162, 232, 0.3)"
                    }}
                  >
                    <Plus size={14} /> Add Angle / View
                  </button>
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Each image here appears in the interactive angle switcher and the "Visual Anatomy & Finishes" breakdown on the product page, complete with its own Title and Description.
                </p>

                {editProdGallery.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {editProdGallery.map((item, gIdx) => (
                      <div key={gIdx} style={{
                        padding: "16px",
                        background: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px"
                      }}>
                        {/* Item Bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            background: "rgba(0, 162, 232, 0.12)",
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            border: "1px solid rgba(0, 162, 232, 0.25)"
                          }}>
                            ANGLE VIEW #{gIdx + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryItemEdit(gIdx)}
                            className="btn"
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                              color: "var(--danger)",
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        {/* View Content Grid: Left image, Right text */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                          gap: "16px",
                          alignItems: "start"
                        }}>
                          {/* Image column */}
                          <div>
                            <div style={{
                              width: "100%",
                              aspectRatio: "4 / 3",
                              borderRadius: "10px",
                              overflow: "hidden",
                              background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(5,7,10,0.9) 100%)",
                              border: "1px solid var(--card-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "8px",
                              padding: "8px"
                            }}>
                              {item.url ? (
                                <img
                                  src={item.url}
                                  alt={item.title || `View ${gIdx + 1}`}
                                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                              ) : (
                                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "12px" }}>
                                  <ImageIcon size={28} style={{ opacity: 0.4, margin: "0 auto 6px auto", display: "block" }} />
                                  Upload photo for this view
                                </div>
                              )}
                            </div>

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleGalleryImageUploadEdit(gIdx, e)}
                              className="form-control"
                              style={{ padding: "6px 10px", fontSize: "0.78rem", border: "1px dashed var(--card-border)" }}
                            />
                            <small style={{ color: "var(--text-muted)", fontSize: "0.72rem", display: "block", marginTop: "4px" }}>
                              PNG/JPEG up to 2MB.
                            </small>
                          </div>

                          {/* Title & Description column */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.82rem" }}>Angle / View Title *</label>
                              <input
                                type="text"
                                placeholder="e.g. Lock Mechanism & Dual Springs"
                                value={item.title || ""}
                                onChange={(e) => handleGalleryItemChangeEdit(gIdx, "title", e.target.value)}
                                className="form-control"
                                style={{ fontSize: "0.88rem", padding: "8px 12px" }}
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.82rem" }}>Angle View Description *</label>
                              <textarea
                                rows={3}
                                placeholder="Describe the specifics visible in this photo (e.g. High-tensile spring steel mechanism tested for silent and smooth latch return without handle drooping)..."
                                value={item.description || ""}
                                onChange={(e) => handleGalleryItemChangeEdit(gIdx, "description", e.target.value)}
                                className="form-control"
                                style={{ fontSize: "0.85rem", lineHeight: 1.5, padding: "8px 12px" }}
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: "24px",
                    textAlign: "center",
                    border: "1px dashed var(--card-border)",
                    borderRadius: "12px",
                    color: "var(--text-muted)"
                  }}>
                    <p style={{ fontSize: "0.88rem", margin: "0 0 10px 0" }}>
                      No multiple image angles added yet. Click "+ Add Angle / View" to add specific views with their own descriptions.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddGalleryItemEdit}
                      className="btn btn-secondary"
                      style={{ padding: "6px 16px", fontSize: "0.82rem" }}
                    >
                      + Add First Angle View
                    </button>
                  </div>
                )}
              </div>

              {/* Form Action Footer */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginTop: "10px",
                paddingTop: "16px",
                borderTop: "1px solid var(--card-border)",
                flexWrap: "wrap"
              }}>
                <Link
                  href={`/product/${editingProduct._id}`}
                  target="_blank"
                  style={{
                    color: "var(--primary)",
                    fontSize: "0.85rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  <ExternalLink size={14} /> Open Live Page in new tab ↗
                </Link>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    id="modal-cancel-btn"
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="btn btn-secondary"
                    style={{ padding: "12px 24px", borderRadius: "10px", fontSize: "0.9rem" }}
                  >
                    Cancel
                  </button>

                  <button
                    id="modal-save-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                    style={{
                      padding: "12px 32px",
                      borderRadius: "10px",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      boxShadow: "0 8px 20px rgba(0, 162, 232, 0.35)"
                    }}
                  >
                    {actionLoading ? "Saving Changes..." : "Save All Changes"}
                  </button>
                </div>
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
