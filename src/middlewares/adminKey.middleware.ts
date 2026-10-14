import { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "crypto";

export function adminKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_API_KEY || "";
  const received = req.header("x-admin-key") || "";
  const valid = expected.length > 0
    && expected.length === received.length
    && timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  if (!valid) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}
