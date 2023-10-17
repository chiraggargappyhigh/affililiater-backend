import { Router } from "express";
import { RedirectController } from "../controllers";

const router = Router();

const publicShareRouter = Router();

const redirectController = new RedirectController();

publicShareRouter.get("/:id", redirectController.handleRedirect);

export default {
  publicShareRouter,
  router,
};
