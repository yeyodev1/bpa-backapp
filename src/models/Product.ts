import { InferSchemaType, model, Schema } from "mongoose";

// Cada producto alimenta una landing de venta. Para vender otro sistema se crea otro
// documento y se despliega la landing con su slug (VITE_PRODUCT_SLUG).
const planSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    period: { type: String, required: true, enum: ["month", "year", "once"] },
    priceCents: { type: Number, required: true, min: 1 },
    note: { type: String },
    badge: { type: String },
    highlighted: { type: Boolean, default: false },
  },
  { _id: false },
);

const featureSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const statSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    brand: {
      logoUrl: { type: String, required: true },
      iconUrl: { type: String },
      primaryColor: { type: String, required: true },
      accentColor: { type: String, required: true },
    },
    hero: {
      eyebrow: { type: String },
      title: { type: String, required: true },
      highlight: { type: String },
      subtitle: { type: String, required: true },
      // Vacío mientras se produce el video: la landing muestra el mockup del sistema.
      videoUrl: { type: String, default: "" },
      posterUrl: { type: String },
    },
    stats: { type: [statSchema], default: [] },
    features: { type: [featureSchema], default: [] },
    includes: { type: [String], default: [] },
    gallery: { type: [{ src: String, alt: String, _id: false }], default: [] },
    support: { type: String },
    plans: { type: [planSchema], required: true },
    taxRate: { type: Number, required: true, min: 0, max: 1 },
    maxSeats: { type: Number, default: 20, min: 1 },
    trustedBy: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },
    whatsapp: { type: String, required: true },
  },
  { timestamps: true },
);

export type ProductDocument = InferSchemaType<typeof productSchema>;
export const Product = model("Product", productSchema);
