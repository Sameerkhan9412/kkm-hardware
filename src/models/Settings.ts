import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  companyName: string;
  brandName: string;
  emails: string[];
  phones: string[];
  address: string;
  whatsapp: string;
  brochureLink: string;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  companyName: { type: String, default: "Kumkum Metal Industries" },
  brandName: { type: String, default: "KMI Architectural Hardware" },
  emails: { type: [String], default: ["kumkummetalindustries@gmail.com", "deepak.kmi@rediffmail.com"] },
  phones: { type: [String], default: ["+91-9927755449", "+91-9927855449"] },
  address: { type: String, default: "Talanagri Ramghat Road, Aligarh - 202001 (U.P) INDIA" },
  whatsapp: { type: String, default: "+919927755449" },
  brochureLink: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
