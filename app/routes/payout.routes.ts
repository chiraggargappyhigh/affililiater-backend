import { Router } from "express";
import { PayoutController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

const payoutController = new PayoutController();

router.get(
  "/balance/:productId",
  authMiddleware.authenticate,
  payoutController.updateRedeemableBalance
);

router.get(
  "/initiate/:productId",
  authMiddleware.authenticate,
  payoutController.createPayoutRequest
);

router.get(
  "/:productId",
  authMiddleware.authenticate,
  payoutController.listPayoutRequests
);

export default router;
