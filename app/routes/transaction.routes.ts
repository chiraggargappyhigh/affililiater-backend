import { Router } from "express";
import { TransactionController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

const transactionController = new TransactionController();

router.post(
  "/",
  authMiddleware.authenticatePublicWebhook,
  transactionController.create
);

router.post(
  "/commission",
  authMiddleware.authenticatePublicWebhook,
  transactionController.addAffiliateCommission
);
router.post(
  "/refund",
  authMiddleware.authenticatePublicWebhook,
  transactionController.refund
);

router.get("/", authMiddleware.authenticate, transactionController.listByUser);
router.get(
  "/:productId",
  authMiddleware.authenticate,
  transactionController.listByProduct
);
router.get(
  "/affiliate/:productId",
  authMiddleware.authenticate,
  transactionController.listByAffiliate
);

export default router;
