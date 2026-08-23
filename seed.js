const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load .env.local variables
const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      process.env[key.trim()] = values.join("=").trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kmi_hardware";

// Define Schemas inside seed file to avoid ts-node complications
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  createdAt: { type: Date, default: Date.now },
});

const SettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Kumkum Metal Industries" },
  brandName: { type: String, default: "KMI Architectural Hardware" },
  emails: { type: [String], default: ["kumkummetalindustries@gmail.com", "deepak.kmi@rediffmail.com"] },
  phones: { type: [String], default: ["+91-9927755449", "+91-9927855449"] },
  address: { type: String, default: "Talanagri Ramghat Road, Aligarh - 202001 (U.P) INDIA" },
  whatsapp: { type: String, default: "+919927755449" },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

// Helper to generate simple clean SVG image strings
function createSvgDataUri(name, color = "#00A2E8") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" rx="10" />
    <rect x="2" y="2" width="396" height="296" fill="none" stroke="${color}" stroke-opacity="0.2" stroke-width="2" rx="8" />
    <circle cx="200" cy="120" r="50" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-width="1.5" filter="url(#glow)" />
    
    <!-- Lock/Handle representation -->
    <path d="M195 100 H205 V140 H195 Z" fill="#ffffff" />
    <circle cx="200" cy="95" r="10" fill="#ffffff" />
    <path d="M185 105 H215" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    
    <text x="50%" y="210" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">${name}</text>
    <text x="50%" y="240" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" letter-spacing="1">PREMIUM HARDWARE</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const seedCategories = [
  { name: "Steel Mortice Handles", slug: "steel-mortice-handles" },
  { name: "SS Mortice Handles", slug: "ss-mortice-handles" },
  { name: "Mortice locks", slug: "mortice-locks" },
  { name: "Main Door Lock", slug: "main-door-lock" },
  { name: "Tribolt Lock", slug: "tribolt-lock" },
  { name: "Steel Pull Handle", slug: "steel-pull-handle" },
  { name: "Stainless Steel Pull Handle", slug: "stainless-steel-pull-handle" },
  { name: "Stainless Steel Pull Handle Lock Set", slug: "stainless-steel-pull-handle-lock-set" }
];

const seedProducts = [
  // Steel Mortice Handles
  { name: "KMI MH-1001 Antique", categorySlug: "steel-mortice-handles" },
  { name: "KMI MH-1002 Chrome", categorySlug: "steel-mortice-handles" },
  { name: "KMI MH-1003 Gold Satin", categorySlug: "steel-mortice-handles" },
  { name: "KMI MH-1005 Antique Brass", categorySlug: "steel-mortice-handles" },
  // SS Mortice Handles
  { name: "KMI MH-2010 Square Rose", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2011 SS Satin", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2012 Antique Gold", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2111 Round Rose Black", categorySlug: "ss-mortice-handles" },
  // Mortice locks
  { name: "KMI ML-22 Latch Lock", categorySlug: "mortice-locks" },
  { name: "KMI ML-24 3-Round Bullet", categorySlug: "mortice-locks" },
  { name: "KMI Coin Cut Cylinder", categorySlug: "mortice-locks" },
  // Main Door Lock
  { name: "KMI DL-Hexon Latch Lock", categorySlug: "main-door-lock" },
  { name: "KMI DL-Verti Bolt Lock", categorySlug: "main-door-lock" },
  // Tribolt Lock
  { name: "KMI TL-Tribolt Latch Lock", categorySlug: "tribolt-lock" },
  { name: "KMI TL-Tribolt BSK Dual Key", categorySlug: "tribolt-lock" },
  // Steel Pull Handle
  { name: "KMI PH-01 Curved", categorySlug: "steel-pull-handle" },
  { name: "KMI PH-02 Straight Classic", categorySlug: "steel-pull-handle" },
  // Stainless Steel Pull Handle
  { name: "KMI PH-1001 6M Gold Matt", categorySlug: "stainless-steel-pull-handle" },
  { name: "KMI PH-1002 6M Matt Black", categorySlug: "stainless-steel-pull-handle" },
  { name: "KMI PH-2013 6M Textured SS", categorySlug: "stainless-steel-pull-handle" },
  // SS Pull Handle Lock Set
  { name: "KMI PH-2011 Lockset Combo", categorySlug: "stainless-steel-pull-handle-lock-set" },
  { name: "KMI PH-2015 Premium Lockset", categorySlug: "stainless-steel-pull-handle-lock-set" }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    // Clean existing data
    console.log("Clearing existing data...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Settings.deleteMany({});
    console.log("Cleared databases!");

    // Seed Settings
    console.log("Seeding settings...");
    await Settings.create({});
    console.log("Seeded default company settings!");

    // Seed Categories
    console.log("Seeding categories...");
    const createdCategories = await Category.insertMany(seedCategories);
    console.log(`Seeded ${createdCategories.length} categories!`);

    // Map categories by slug for referencing
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed Products
    console.log("Seeding products...");
    const productsToInsert = seedProducts.map((p) => {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Category slug '${p.categorySlug}' not found for product '${p.name}'`);
      }
      return {
        name: p.name,
        image: createSvgDataUri(p.name),
        category: categoryId,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Seeded ${createdProducts.length} products!`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
