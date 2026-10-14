import { InferSchemaType, model, Schema } from "mongoose";

// Solicitudes de "Reserva tu asesoría" del sitio de BPA.
const leadSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    company: { type: String, maxlength: 120 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, required: true, maxlength: 16 },
    interest: { type: String, required: true, maxlength: 60 },
    message: { type: String, maxlength: 1500 },
    preferredDate: { type: String, maxlength: 40 },
    source: { type: String, default: "web", maxlength: 40 },
    status: { type: String, enum: ["new", "contacted", "won", "lost"], default: "new" },
  },
  { timestamps: true },
);

export type LeadDocument = InferSchemaType<typeof leadSchema>;
export const Lead = model("Lead", leadSchema);
