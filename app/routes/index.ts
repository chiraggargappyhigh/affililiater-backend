import { Router } from "express";
import UserRouter from "./user.routes";
import ProductRouter from "./product.routes";
import AffiliateRouter from "./affiliate.routes";
import TransactionRouter from "./transaction.routes";
import RedirectRouter from "./redirect.routes";
// Init router and path
const router = Router();

// Add sub-routes
router.use("/user", UserRouter);
router.use("/product", ProductRouter);
router.use("/affiliate", AffiliateRouter);
router.use("/transaction", TransactionRouter);
router.use("/redirect", RedirectRouter.router);

// Export the base-router
export default router;
