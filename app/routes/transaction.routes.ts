import { Router } from "express";
import { TransactionController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = Router();

const transactionController = new TransactionController();
const authMiddleware = new AuthMiddleware();

router.post(
  "/",
  authMiddleware.blockRequestsFroBrowser,
  authMiddleware.authenticatePublicWebhook,
  transactionController.create
);
router.post(
  "/refund",
  authMiddleware.blockRequestsFroBrowser,
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
