import { Router } from "express";
import { PayoutController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = Router();

const payoutController = new PayoutController();
const authMiddleware = new AuthMiddleware();

router.get(
  "/balance/:productId",
  authMiddleware.authenticate,
  payoutController.updateRedeemableBalance
);

export default router;
