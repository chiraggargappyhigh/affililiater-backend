import { Router } from "express";
import { UserController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = Router();

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

router.post("/login", userController.login);
router.get(
  "/refresh-token",
  authMiddleware.authenticate,
  userController.refreshTokens
);
router.get("/", authMiddleware.authenticate, userController.read);

export default router;
