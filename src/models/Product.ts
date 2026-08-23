import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./Category";

export interface IProduct extends Document {
  name: string;
  image?: string; // Base64 data URI (optional)
  category: mongoose.Types.ObjectId | ICategory;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: "" }, // Base64 data string (not required)
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

