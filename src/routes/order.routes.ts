import { Router } from "express";
import { confirmOrderController, createOrderController, listOrdersController, retryOrderController } from "../controllers/order.controller";
import { adminKeyMiddleware } from "../middlewares/adminKey.middleware";

const orderRouter = Router();

orderRouter.post("/", createOrderController);
orderRouter.post("/payphone/confirm", confirmOrderController);
orderRouter.post("/:reference/retry", retryOrderController);
orderRouter.get("/admin/list", adminKeyMiddleware, listOrdersController);

export default orderRouter;
