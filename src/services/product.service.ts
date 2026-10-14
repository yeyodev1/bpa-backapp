import { CustomError } from "../errors/customError.error";
import { Product } from "../models/Product";

export async function getPublicProduct(slug: string) {
  const product = await Product.findOne({ slug, active: true }).lean();
  if (!product) throw new CustomError("Producto no disponible", 404);
  const { _id, __v, createdAt, updatedAt, ...publicProduct } = product as typeof product & { __v?: number };
  return publicProduct;
}
