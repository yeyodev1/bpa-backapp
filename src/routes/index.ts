import express, { Application } from "express";
import productRouter from "./product.routes";
import orderRouter from "./order.routes";
import leadRouter from "./lead.routes";

function routerApi(app: Application) {
  const router = express.Router();
  app.use("/api", router);

  router.use("/products", productRouter);
  router.use("/orders", orderRouter);
  router.use("/leads", leadRouter);
}

export default routerApi;
