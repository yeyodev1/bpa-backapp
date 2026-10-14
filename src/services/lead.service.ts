import { Lead } from "../models/Lead";
import { CustomError } from "../errors/customError.error";
import { readBody, readEmail, readPhone, readText } from "./validators";

const INTERESTS = ["software-a-medida", "sistema-medico", "smartmedic", "logistica", "integraciones", "otro"];

export async function createLead(payload: unknown) {
  const body = readBody(payload);
  // Honeypot anti-bots: el campo "website" está oculto en el formulario.
  if (typeof body.website === "string" && body.website.trim()) return { ok: true };

  const interest = readText(body.interest, "interest", 60);
  if (!INTERESTS.includes(interest)) throw new CustomError("interest is invalid", 400);

  await Lead.create({
    name: readText(body.name, "name", 120),
    company: readText(body.company, "company", 120, false),
    email: readEmail(body.email),
    phone: readPhone(body.phone),
    interest,
    message: readText(body.message, "message", 1500, false),
    preferredDate: readText(body.preferredDate, "preferredDate", 40, false),
    source: readText(body.source, "source", 40, false) || "web",
  });
  return { ok: true };
}

export async function listLeads() {
  return Lead.find().sort({ createdAt: -1 }).limit(500).lean();
}
