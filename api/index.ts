import type { Request, Response } from "express";
import { createApp } from "../src/app";
import { dbConnect } from "../src/config/mongo";

const { app } = createApp();

export default async function handler(req: Request, res: Response) {
  try {
    await dbConnect();
  } catch (error) {
    console.error(error);
    // JSON con 503 en vez de que la función se caiga: los frontends pasan a su modo WhatsApp.
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(503).json({ message: "Servicio no disponible por el momento." });
  }
  return app(req, res);
}
