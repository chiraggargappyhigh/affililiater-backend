import { Router } from "express";
import { AffiliateController } from "../controllers";
import { AuthMiddleware, AffiliateMiddleware } from "../middlewares";

const router = Router();

const affiliateController = new AffiliateController();
const authMiddleware = new AuthMiddleware();
const affiliateMiddleware = new AffiliateMiddleware();

router.post("/", authMiddleware.authenticate, affiliateController.create);
router.get(
  "/:productId",
  authMiddleware.authenticate,
  affiliateController.readUserAffiliate
);
router.get(
  "/",
  authMiddleware.authenticate,
  affiliateController.listUserAffiliates
);
router.put(
  "/update-payout/:affiliateId",
  authMiddleware.authenticate,
  affiliateMiddleware.authorizeUser,
  affiliateController.addPayoutDetails
);
router.get(
  "/extra-link/:affiliateId",
  authMiddleware.authenticate,
  affiliateMiddleware.authorizeUser,
  affiliateController.createExtraLink
);
router.delete(
  "/extra-link/:affiliateId",
  authMiddleware.authenticate,
  affiliateMiddleware.authorizeUser,
  affiliateController.deleteExtraLink
);

export default router;
