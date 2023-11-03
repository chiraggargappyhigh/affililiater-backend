import { Router } from "express";
import { ProductController } from "../controllers";
import { productMiddleware, authMiddleware } from "../middlewares";

const router = Router();

const productController = new ProductController();

router.post(
  "/",
  authMiddleware.authenticate,
  productMiddleware.verifyProductData,
  productController.create
);

router.put(
  "/:id/default-config",
  authMiddleware.authenticate,
  productController.addDefaultConfig
);

router.put(
  "/:id/members",
  authMiddleware.authenticate,
  //@TODO: productMiddleware.verifyMemberData,
  productController.addMembers
);

router.patch(
  "/:id/members/:userId",
  authMiddleware.authenticate,
  //@TODO: productMiddleware.verifyMemberData,
  productController.updateMember
);

router.get("/:id", authMiddleware.authenticate, productController.read);
router.get("/", authMiddleware.authenticate, productController.list);

export default router;
