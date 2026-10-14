import { Request, Response, NextFunction } from "express";

export function globalErrorHandler(error: any, _req: Request, res: Response, _next: NextFunction) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 && !error.status ? "Internal Server Error" : error.message });
}
