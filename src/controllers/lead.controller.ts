import { Request, Response, NextFunction } from "express";
import { createLead, listLeads } from "../services/lead.service";

export async function createLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await createLead(req.body));
  } catch (error) {
    next(error);
  }
}

export async function listLeadsController(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ leads: await listLeads() });
  } catch (error) {
    next(error);
  }
}
