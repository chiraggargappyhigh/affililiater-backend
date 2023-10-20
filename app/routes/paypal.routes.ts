import { Router } from "express";
import { PaypalController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = Router();
const paypalController = new PaypalController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/connect",
  authMiddleware.authenticate,
  paypalController.connectPaypal
);

export default router;
