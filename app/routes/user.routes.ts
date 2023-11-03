import { Router } from "express";
import { UserController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

const userController = new UserController();

router.post("/login", userController.login);
router.get(
  "/refresh-token",
  authMiddleware.authenticate,
  userController.refreshTokens
);
router.get("/", authMiddleware.authenticate, userController.read);
router.get("/login-method/:email", userController.getLoginMethod);

export default router;
