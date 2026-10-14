import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { dbConnect } from "../config/mongo";
import { Product } from "../models/Product";
import { LicenseOrder } from "../models/LicenseOrder";
import { Lead } from "../models/Lead";
import { smartmedicProduct } from "../data/smartmedic.product";

// Crea/actualiza los productos y los índices. Es idempotente: se puede correr varias veces.
async function seed() {
  await dbConnect();
  await Promise.all([Product.syncIndexes(), LicenseOrder.syncIndexes(), Lead.syncIndexes()]);

  for (const product of [smartmedicProduct]) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true, runValidators: true });
    console.log(`Producto listo: ${product.slug}`);
  }

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
