import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = !!(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  console.warn(
    "⚠️ Cloudinary is not configured in .env.local. Storing base64 images directly in the database instead."
  );
}

/**
 * Uploads a base64 image string to Cloudinary.
 * If Cloudinary is not configured, returns the base64 string as a fallback.
 */
export async function uploadToCloudinary(base64Image: string, folder: string = "kmi_hardware"): Promise<string> {
  if (!base64Image) return "";

  // If it's already a URL (e.g. from a seed or editing without changes) or not a base64 Data URI, return as-is
  if (base64Image.startsWith("http://") || base64Image.startsWith("https://") || !base64Image.startsWith("data:")) {
    return base64Image;
  }

  if (!isConfigured) {
    return base64Image;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: "image",
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}
