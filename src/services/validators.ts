import { CustomError } from "../errors/customError.error";

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readText(value: unknown, field: string, max: number, required = true) {
  const text = typeof value === "string" ? value.trim() : "";
  if ((required && !text) || text.length > max) throw new CustomError(`Revisa el campo ${field}`, 400);
  return text;
}

export function readEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!validEmail.test(email) || email.length > 254) throw new CustomError("Revisa tu correo electrónico", 400);
  return email;
}

// Acepta 09XXXXXXXX, 5939XXXXXXXX, +5939XXXXXXXX o números internacionales en formato E.164.
export function readPhone(value: unknown) {
  const phone = typeof value === "string" ? value.trim().replace(/[\s()-]/g, "") : "";
  if (/^09\d{8}$/.test(phone)) return `+593${phone.slice(1)}`;
  if (/^5939\d{8}$/.test(phone)) return `+${phone}`;
  if (/^\+[1-9]\d{6,14}$/.test(phone)) return phone;
  throw new CustomError("Revisa tu número de celular", 400);
}

export function readBody(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new CustomError("Faltan datos en la solicitud", 400);
  return payload as Record<string, unknown>;
}
