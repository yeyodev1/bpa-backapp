import { Router } from "express";
import { createLeadController, listLeadsController } from "../controllers/lead.controller";
import { adminKeyMiddleware } from "../middlewares/adminKey.middleware";

const leadRouter = Router();

leadRouter.post("/", createLeadController);
leadRouter.get("/admin/list", adminKeyMiddleware, listLeadsController);

export default leadRouter;
