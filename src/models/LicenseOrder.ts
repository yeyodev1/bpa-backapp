import { InferSchemaType, model, Schema } from "mongoose";

const planSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    period: { type: String, required: true },
    unitPriceCents: { type: Number, required: true },
  },
  { _id: false },
);

const buyerSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    identification: { type: String, required: true, maxlength: 13 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, required: true, maxlength: 16 },
    clinic: { type: String, maxlength: 120 },
    city: { type: String, required: true, maxlength: 80 },
  },
  { _id: false },
);

const licenseOrderSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    productSlug: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    plan: { type: planSnapshotSchema, required: true },
    seats: { type: Number, required: true, min: 1 },
    buyer: { type: buyerSchema, required: true },
    subtotalCents: { type: Number, required: true, min: 0 },
    taxCents: { type: Number, required: true, min: 0 },
    totalCents: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["pending", "paid", "failed"], default: "pending" },
    clientTransactionId: { type: String, required: true, unique: true },
    payphoneTransactionId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

export type LicenseOrderDocument = InferSchemaType<typeof licenseOrderSchema>;
export const LicenseOrder = model("LicenseOrder", licenseOrderSchema);
