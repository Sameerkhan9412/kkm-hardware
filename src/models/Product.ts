import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./Category";

export interface IProductGalleryItem {
  url: string;
  title?: string;
  description?: string;
}

export interface IProduct extends Document {
  name: string;
  image?: string; // Base64 data URI or image URL
  category: mongoose.Types.ObjectId | ICategory;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  gallery?: IProductGalleryItem[];
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: "" },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
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

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);


