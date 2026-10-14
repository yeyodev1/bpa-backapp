import { Request, Response, NextFunction } from "express";
import { confirmLicenseOrder, createLicenseOrder, listLicenseOrders, retryLicenseOrder } from "../services/order.service";

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await createLicenseOrder(req.body));
  } catch (error) {
    next(error);
  }
}

export async function confirmOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await confirmLicenseOrder(req.body));
  } catch (error) {
    next(error);
  }
}

export async function retryOrderController(req: Request, res: Response, next: NextFunction) {
  try {
    const reference = Array.isArray(req.params.reference) ? req.params.reference[0] : req.params.reference;
    res.json(await retryLicenseOrder(reference));
  } catch (error) {
    next(error);
  }
}

export async function listOrdersController(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ orders: await listLicenseOrders() });
  } catch (error) {
    next(error);
  }
}
