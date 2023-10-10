const express = require("express");
const router = express.Router();
const userController = require("../../../controller/app/v1/userController");
const { PLATFORM } = require("../../../constants/auth");
const authenticateJWT = require("../../../middleware/login");
// router.route("/app/api/v1/user/me").get(userController.getLoggedInUserInfo);
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

// router
//   .route("/app/api/v1/user/info")
//   .get(authenticateJWT(), userController.getUserInfo);

router.route("/app/api/v1/user/user-login").post(userController.loginUser);
// router.route("/app/api/v1/affiliate").post(userController.afflliate);
router
  .route("/app/api/v1/affiliate-code")
  .post(authenticateJWT, userController.afflliateCode);

router.route("/app/api/v1/sales-by-app").get(userController.salesByApp);
router.route("/app/api/v1/sales-by-user").get(authenticateJWT, userController.salesByUser);


router.route("/app/api/v1/products").get(userController.Products);
router.get(
  "/app/api/v1/user/products",
  authenticateJWT,
  userController.userProducts
);
router
  .route("/app/api/v1/product")
  .get(authenticateJWT, userController.userProduct);

router.route("/app/api/v1/transaction").put(userController.transactionWebhook);

router
  .route("/app/api/v1/user")
  .get(authenticateJWT, userController.user);

// router
//   .route("/app/api/v1/user/update-profile")
//   .post(authenticateJWT(), userController.updateUserProfile);

module.exports = router;
