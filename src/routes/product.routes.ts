import { Router } from "express";
import { getProductController } from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/:slug", getProductController);

export default productRouter;
