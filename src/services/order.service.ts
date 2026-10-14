import { randomUUID } from "crypto";
import { CustomError } from "../errors/customError.error";
import { LicenseOrder, LicenseOrderDocument } from "../models/LicenseOrder";
import { Product } from "../models/Product";
import { confirmPayphoneTransaction, payphoneConfig } from "./payphone.service";
import { readBody, readEmail, readPhone, readText } from "./validators";

function newReference() {
  return `BPA-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
}

function readIdentification(value: unknown) {
  const identification = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if (!/^\d{10}$/.test(identification) && !/^\d{13}$/.test(identification)) {
    throw new CustomError("La cédula debe tener 10 dígitos o el RUC 13", 400);
  }
  return identification;
}

export function toPublicOrder(order: LicenseOrderDocument) {
  return {
    reference: order.reference,
    productSlug: order.productSlug,
    productName: order.productName,
    plan: order.plan,
    seats: order.seats,
    buyerName: order.buyer.name,
    subtotalCents: order.subtotalCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    status: order.status,
    paidAt: order.paidAt,
  };
}

function payphonePayload(order: LicenseOrderDocument) {
  const { token, storeId } = payphoneConfig();
  // Payphone trabaja en centavos: amount = amountWithTax + tax (+ amountWithoutTax).
  return {
    token,
    storeId,
    clientTransactionId: order.clientTransactionId,
    amount: order.totalCents,
    amountWithTax: order.subtotalCents,
    amountWithoutTax: 0,
    tax: order.taxCents,
    currency: "USD",
    reference: `${order.productName} · ${order.plan.name} x${order.seats}`,
    email: order.buyer.email,
    phoneNumber: order.buyer.phone,
    documentId: order.buyer.identification,
  };
}

export async function createLicenseOrder(payload: unknown) {
  const body = readBody(payload);
  const slug = readText(body.productSlug, "productSlug", 60);
  const product = await Product.findOne({ slug, active: true });
  if (!product) throw new CustomError("Producto no disponible", 404);

  const plan = product.plans.find((item) => item.id === body.planId);
  if (!plan) throw new CustomError("Plan no válido", 400);

  const seats = body.seats;
  if (typeof seats !== "number" || !Number.isSafeInteger(seats) || seats < 1 || seats > (product.maxSeats ?? 20)) {
    throw new CustomError("Número de profesionales no válido", 400);
  }

  const buyerInput = body.buyer && typeof body.buyer === "object" ? body.buyer as Record<string, unknown> : {};
  const buyer = {
    name: readText(buyerInput.name, "buyer.name", 120),
    identification: readIdentification(buyerInput.identification),
    email: readEmail(buyerInput.email),
    phone: readPhone(buyerInput.phone),
    clinic: readText(buyerInput.clinic, "buyer.clinic", 120, false),
    city: readText(buyerInput.city, "buyer.city", 80),
  };

  // Falla antes de guardar si Payphone no está configurado.
  payphoneConfig();

  const subtotalCents = plan.priceCents * seats;
  const taxCents = Math.round(subtotalCents * product.taxRate);
  const order = await LicenseOrder.create({
    reference: newReference(),
    productSlug: product.slug,
    productName: product.name,
    plan: { id: plan.id, name: plan.name, period: plan.period, unitPriceCents: plan.priceCents },
    seats,
    buyer,
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    status: "pending",
    clientTransactionId: newReference(),
  });

  return { order: toPublicOrder(order), payphone: payphonePayload(order) };
}

export async function confirmLicenseOrder(payload: unknown) {
  const body = readBody(payload);
  const id = body.id;
  const validId = (typeof id === "string" && /^\d{1,20}$/.test(id)) || (typeof id === "number" && Number.isSafeInteger(id) && id > 0);
  const clientTransactionId = readText(body.clientTransactionId, "clientTransactionId", 50);
  if (!validId) throw new CustomError("id is invalid", 400);

  const order = await LicenseOrder.findOne({ clientTransactionId });
  if (!order) throw new CustomError("No encontramos esta orden", 404);
  if (order.status === "paid") return { order: toPublicOrder(order) };

  const confirmation = await confirmPayphoneTransaction(id as string | number, clientTransactionId);
  const approved = confirmation.statusCode === 3
    && confirmation.clientTransactionId === order.clientTransactionId
    && confirmation.amount === order.totalCents;

  order.status = approved ? "paid" : "failed";
  if (approved) {
    order.payphoneTransactionId = String(confirmation.transactionId ?? id);
    order.paidAt = new Date();
  }
  await order.save();

  return {
    order: toPublicOrder(order),
    message: approved ? undefined : typeof confirmation.message === "string" ? confirmation.message : "El pago no fue aprobado",
  };
}

// Reintento: nuevo clientTransactionId para la misma orden (Payphone no acepta repetirlo).
export async function retryLicenseOrder(reference: string) {
  const order = await LicenseOrder.findOne({ reference });
  if (!order) throw new CustomError("No encontramos esta orden", 404);
  if (order.status === "paid") throw new CustomError("Esta orden ya fue pagada", 409);
  order.clientTransactionId = newReference();
  order.status = "pending";
  await order.save();
  return { order: toPublicOrder(order), payphone: payphonePayload(order) };
}

export async function listLicenseOrders() {
  return LicenseOrder.find().sort({ createdAt: -1 }).limit(500).lean();
}
