import { Router } from "express";
import { PaypalController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();
const paypalController = new PaypalController();

router.post(
  "/connect",
  authMiddleware.authenticate,
  paypalController.connectPaypal
);

export default router;
