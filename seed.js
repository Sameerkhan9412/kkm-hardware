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
  description: { type: String, default: "" },
  features: { type: [String], default: [] },
  specifications: { type: Map, of: String, default: {} },
  gallery: [
    {
      url: { type: String, required: true },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    }
  ],
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
  // 1. Starting Product: KMI PH-2011 6M Pull Handles Lock Set
  { 
    name: "KMI PH-2011 6M Pull Handles Lock Set", 
    categorySlug: "stainless-steel-pull-handle-lock-set", 
    image: "/images/banners/banner-lockset.jpg",
    description: "The KMI PH-2011 6M is an architectural-grade main door pull handle and complete security lock set. Precision-engineered from solid AISI 304 grade stainless steel with decorative segmented brass antique inserts. Designed for luxury villas, grand bungalows, and commercial entrance doors demanding unmatched security and prestigious aesthetics.",
    features: [
      "Complete All-in-One Entrance Lock Set (Handles + Mortice Lock Body + Cylinder + Keys)",
      "Crafted from Solid Non-Magnetic Stainless Steel 304 Grade",
      "Multi-Layer PVD Vacuum Plated Finish - High Salt Spray & Scratch Resistance",
      "Ergonomic Rectangular Segmented Grip with Chamfered Edges",
      "High-Security 6-Pin Brass Euro Cylinder with 3 Computer Dimple Keys",
      "Suitable for Wooden, Glass, and Metal Entrance Doors (35mm - 60mm thickness)"
    ],
    specifications: {
      "Brand": "KMI Architectural Hardware",
      "Model No": "KMI PH-2011 6M",
      "Handle Length": "16 Inches (400mm)",
      "Hole-to-Hole Distance": "250mm / 300mm",
      "Handle Width": "40mm",
      "Material Grade": "Virgin AISI 304 Stainless Steel + Brass Elements",
      "Available Finishes": "SS Satin, Black Silver, Brass Antique & Matt Black",
      "Lock Mechanism": "Double Throw Heavy-Duty Mortice Deadbolt + Roller Latch",
      "Keys Included": "3 High-Security Precision Brass Computer Keys",
      "Door Compatibility": "Main Entrance Doors, Double Doors, Flush Doors",
      "Door Thickness": "35mm to 65mm",
      "Testing Standard": "Tested for over 200,000 Operations"
    },
    gallery: [
      {
        url: "/images/banners/banner-lockset.jpg",
        title: "Main Infographic & Technical Specification Card",
        description: "Comprehensive specification card highlighting key dimensions (400mm length, 40mm width), available multi-color finishes, back view mounting, and the complete mortice lockset hardware suite."
      },
      {
        url: "/images/products/ph2011-grip.jpg",
        title: "Solid SS 304 Segmented Grip Detail",
        description: "Close-up perspective of the precision CNC-milled segmented tactile bar. Featuring hand-finished antique brass inlays between solid stainless steel segments, providing a comfortable, slip-resistant grip."
      },
      {
        url: "/images/products/ph2011-cylinder.jpg",
        title: "High Security Brass Euro Cylinder & Accessories",
        description: "Detailed view of the 70mm solid brass euro profile cylinder with 6-pin tumbler mechanism, 3 anti-copy brass computer keys, solid brass strike box, and matching architectural mounting screws."
      }
    ]
  },

  // 2. Starting Product: KMI MH-1001 Antique Mortice Handle
  { 
    name: "KMI MH-1001 Antique", 
    categorySlug: "steel-mortice-handles", 
    image: "/images/banners/banner-mortise.jpg",
    description: "The KMI MH-1001 Antique Mortice Handle represents classic British and Indian architectural heritage. Built with a solid forged metal backplate and a curved ergonomic lever, this handle is finished in a timeless hand-buffed Antique Brass patina coated with protective electro-lacquer.",
    features: [
      "Forged Solid Backplate with Bevelled Edge Detailing",
      "Ergonomic Curved Lever Handle Designed for Effortless Natural Grip",
      "Hand-Buffed Antique Brass Finish with Anti-Tarnish Protective Clear Coat",
      "Heavy-Duty Internal Steel Spring for Lifetime Horizontal Alignment",
      "Universal Reversible Handing for Left or Right Opening Doors",
      "Standard Euro Profile Cutout Compatible with All Standard Mortice Lock Bodies"
    ],
    specifications: {
      "Brand": "KMI Architectural Hardware",
      "Model No": "KMI MH-1001 Antique",
      "Backplate Dimensions": "240mm x 45mm x 10mm",
      "Lever Length": "125mm",
      "Material": "Solid Architectural Steel & Brass Composite",
      "Finish": "Hand-Buffed Antique Brass with Protective Lacquer",
      "Spindle Size": "8mm Heavy-Duty Square Steel Spindle",
      "Fixing Type": "Quadruple Countersunk Solid Screws with Matching Finish",
      "Door Compatibility": "Interior & Exterior Wooden Doors (30mm - 55mm)",
      "Cycle Rating": "200,000+ Mechanical Cycles Certified"
    },
    gallery: [
      {
        url: "/images/banners/banner-mortise.jpg",
        title: "Front Elevation - Antique Brass Finish",
        description: "Full vertical profile showing the elegant proportion of the bevelled backplate, precision keyhole cutout, and the contoured handle lever with hand-buffed warm antique highlights."
      },
      {
        url: "/images/products/mh1001-door.jpg",
        title: "Installed on Luxury Dark Walnut Door",
        description: "Architectural interior view showing the handle fitted onto a solid panelled walnut door. Demonstrates how the antique brass finish adds warmth, character, and luxury to classical interiors."
      },
      {
        url: "/images/products/ph2011-cylinder.jpg",
        title: "Matching Cylinder & Security Keyway Compatibility",
        description: "Compatible with KMI standard 60mm and 70mm brass euro cylinders, providing seamless locking performance for master bedroom, office, and entrance doors."
      }
    ]
  },

  // 3. Starting Product: KMI PH-2221 6M Capsule Pulls Trio
  { 
    name: "KMI PH-2221 6M Capsule Pulls Trio", 
    categorySlug: "stainless-steel-pull-handle", 
    image: "/images/banners/banner-pulls.jpg",
    description: "The KMI PH-2221 6M Capsule Pull Handle trio embodies minimalist contemporary luxury. With rounded capsule ends, flat profile bar, and recessed standoff collars, these handles make a striking statement on modern entrance doors, frameless glass entries, and boutique retail storefronts.",
    features: [
      "Sleek Capsule Curved Geometry with Gentle Radiused Edges",
      "Available in 3 Designer Finishes: Brushed Gold, Satin SS, and Matt Black",
      "Forged from Heavy-Gauge Solid 304 Stainless Steel",
      "Versatile Dual Mounting Options (Back-to-Back Pairs or Single Side Mounting)",
      "Resistant to High Humidity, Salt Air, and UV Degradation",
      "Includes Specialized High-Tensile Fixings for Glass and Wood Doors"
    ],
    specifications: {
      "Brand": "KMI Architectural Hardware",
      "Model No": "KMI PH-2221 6M Capsule Trio",
      "Available Sizes": "12\" (300mm), 16\" (400mm), 24\" (600mm)",
      "Bar Width": "45mm",
      "Material Grade": "AISI 304 Non-Magnetic Stainless Steel",
      "Finish Options": "Champagne Brass Gold, Satin SS Brushed, Deep Matt Black",
      "Mounting Type": "Back-to-Back (Pair) or Bolt-Through (Single)",
      "Glass Door Hole Size": "12mm - 14mm Diameter Holes",
      "Door Compatibility": "Frameless Glass Doors, Pivot Wooden Doors, Aluminium Profiles"
    },
    gallery: [
      {
        url: "/images/banners/banner-pulls.jpg",
        title: "Finishes Trio Showcase (Gold, Satin SS, Matt Black)",
        description: "Side-by-side presentation of the three signature architectural finishes, demonstrating the flawless brushed texture and uniform PVD surface treatment across the trio."
      },
      {
        url: "/images/products/ph2221-door.jpg",
        title: "Grand Pivot Entrance Door Installation",
        description: "Installed on an oversized luxury pivot front door in a modern villa setting. Illustrates how the Champagne Gold finish harmonizes with natural wood grains and expansive glass elements."
      },
      {
        url: "/images/products/ph2011-grip.jpg",
        title: "Solid SS Standoff Mounts & Concealed Fixing Detail",
        description: "Heavy-duty solid stainless steel mounting feet engineered with concealed grub screw fastenings to ensure a rock-solid, rattle-free installation on high-traffic entryways."
      }
    ]
  },

  // 4. Starting Product: KMI DL-Verti Bolt Lock
  { 
    name: "KMI DL-Verti Bolt Lock", 
    categorySlug: "main-door-lock", 
    image: "/images/banners/banner-vertibolt.jpg",
    description: "The KMI DL-Verti Bolt is a high-security surface-mounted main door rim lock. Utilizing heavy-duty dual vertical deadbolts that drop vertically into an interlocking hardened strike box, it provides unyielding resistance against jimmying, prying, and door frame spreading attacks.",
    features: [
      "Jimmy-Proof Dual Vertical Deadbolts Engineered from High-Tensile Brass Alloy",
      "Heavy Zamak Pressure Die-Cast Casing with Antique Brass Textured Body",
      "Solid Brass Interior Turn Knob for Convenient Single-Hand Operation",
      "Reinforced Heavy-Gauge Steel Strike Keeper Resists Forced Entry",
      "29mm Long Solid Brass High-Security Pin-Tumbler Cylinder",
      "Supplied with 3 Precision Dimple Keys and Anti-Drill Protective Plate"
    ],
    specifications: {
      "Brand": "KMI Architectural Hardware",
      "Model No": "KMI DL-Verti Bolt",
      "Lock Type": "Surface Mounted Rim Vertical Bolt Lock",
      "Body Dimensions": "120mm x 85mm x 32mm",
      "Bolt Type": "Dual Vertical Interlocking Solid Hardened Bolts",
      "Cylinder Length": "29mm Heavy Brass Cylinder",
      "Body Material": "High-Grade Zamak Die-Cast Alloy + Solid Brass Parts",
      "Exterior Finish": "Antique Brass & Matte Black Powder Coat",
      "Operation": "Key Outside / Solid Brass Turn Knob Inside",
      "Door Thickness": "30mm to 55mm Wood or Metal Doors",
      "Standard": "Tested to Withstand Over 1.5 Tons of Lateral Crowbar Force"
    },
    gallery: [
      {
        url: "/images/banners/banner-vertibolt.jpg",
        title: "Lock Body, Dual Bolts & Brass Turn Knob",
        description: "Detailed view of the Zamak housing, dual vertical locking pins, and solid brass thumb turn knob on a luxury marble and wood presentation stand."
      },
      {
        url: "/images/products/vertibolt-door.jpg",
        title: "Installed on Solid Teak Interior Door",
        description: "In-situ interior installation view demonstrating the surface mount aesthetic, seamless engagement into the door jamb keeper, and effortless hand operation."
      },
      {
        url: "/images/banners/banner-lockbody.jpg",
        title: "Interlocking Heavy Strike Box & Reversible Latch Mechanism",
        description: "Heavy reinforced steel strike box design that anchors into the door frame with long hardened screws to prevent frame splitting under heavy physical impact."
      }
    ]
  },

  // 5. Starting Product: KMI ML-22 Latch Lock Body
  { 
    name: "KMI ML-22 Latch Lock", 
    categorySlug: "mortice-locks", 
    image: "/images/banners/banner-lockbody.jpg",
    description: "The KMI ML-22 is a heavy-duty architectural mortice lock body engineered for residential and commercial security. Built with a zinc-chromate rust-proof steel case, solid brass reversible latch, and a double-throw solid deadbolt tested to withstand 200,000+ mechanical cycles.",
    features: [
      "Corrosion-Resistant Zinc-Chromated Steel Casing (1.5mm Heavy Gauge)",
      "Solid Forged Brass Latch with Quick-Reversible Toolless Mechanism",
      "Full 20mm Double-Throw Solid Deadbolt with Anti-Saw Hardened Steel Rollers",
      "Grade 304 Brushed Stainless Steel Faceplate & Striking Plate",
      "Standard 85mm Center-to-Center Distance (PZ 85) for Universal Handle Fit",
      "Supplied with 3 Precision Dimple Keys and Euro Cylinder Mounting Screws"
    ],
    specifications: {
      "Brand": "KMI Architectural Hardware",
      "Model No": "KMI ML-22 Latch Lock Body",
      "Backset": "50mm / 60mm Backset Options",
      "Center Distance": "85mm (PZ 85)",
      "Faceplate Dimensions": "240mm x 22mm x 3mm Stainless Steel 304",
      "Case Dimensions": "175mm x 75mm x 14mm",
      "Deadbolt Throw": "20mm (Double Throw)",
      "Latch Type": "Reversible Solid Brass Roller Latch",
      "Cylinder Hole": "Standard Euro Profile Cutout",
      "Certifications": "Conforms to IS 3818 / EN 12209 Security Standards",
      "Durability": "Tested for 200,000+ Operations with Zero Latch Failure"
    },
    gallery: [
      {
        url: "/images/banners/banner-lockbody.jpg",
        title: "Mortice Lock Body Assembly with 3 Keys",
        description: "Full view of the green zinc-chromated lock case, stainless steel forend plate, reversible roller latch, and 3 high-precision dimple brass keys."
      },
      {
        url: "/images/products/ml22-door.jpg",
        title: "Flush Door Edge Mortice Installation",
        description: "Precision mortise installation on the door edge, highlighting the flush alignment of the SS 304 faceplate, extended deadbolt, and solid brass roller latch."
      },
      {
        url: "/images/products/ph2011-cylinder.jpg",
        title: "Internal Spring Mechanism & Anti-Friction Components",
        description: "Internal steel components with self-lubricating phosphor bronze bushings to guarantee smooth, whisper-quiet operation during daily commercial usage."
      }
    ]
  },

  // Other products
  { name: "KMI MH-1002 Chrome", categorySlug: "steel-mortice-handles" },
  { name: "KMI MH-1003 Gold Satin", categorySlug: "steel-mortice-handles" },
  { name: "KMI MH-1005 Antique Brass", categorySlug: "steel-mortice-handles" },
  // SS Mortice Handles
  { name: "KMI MH-2010 Square Rose", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2011 SS Satin", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2012 Antique Gold", categorySlug: "ss-mortice-handles" },
  { name: "KMI MH-2111 Round Rose Black", categorySlug: "ss-mortice-handles" },
  // Mortice locks
  { name: "KMI ML-24 3-Round Bullet", categorySlug: "mortice-locks" },
  { name: "KMI Coin Cut Cylinder", categorySlug: "mortice-locks" },
  // Main Door Lock
  { name: "KMI DL-Hexon Latch Lock", categorySlug: "main-door-lock" },
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
    const baseTime = Date.now();
    const productsToInsert = seedProducts.map((p, idx) => {
      const categoryId = categoryMap[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Category slug '${p.categorySlug}' not found for product '${p.name}'`);
      }
      // If product has real image, give it a later timestamp so it appears first in featured
      const timestampOffset = p.image ? 100000 + idx * 1000 : idx * 10;
      return {
        name: p.name,
        image: p.image || createSvgDataUri(p.name),
        category: categoryId,
        description: p.description || "",
        features: p.features || [],
        specifications: p.specifications || {},
        gallery: p.gallery || [],
        createdAt: new Date(baseTime + timestampOffset),
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
