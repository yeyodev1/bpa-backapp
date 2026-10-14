import { Request, Response, NextFunction } from "express";
import { getPublicProduct } from "../services/product.service";

export async function getProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    res.json({ product: await getPublicProduct(slug) });
  } catch (error) {
    next(error);
  }
}
