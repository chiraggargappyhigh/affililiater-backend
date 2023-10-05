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
router.route("/app/api/v1/affiliate-code").post(userController.afflliateCode);

router.route("/app/api/v1/sales").post(userController.sales);
router.route("/app/api/v1/products").post(authenticateJWT, userController.userProducts);
router.route("/app/api/v1/product").post(authenticateJWT, userController.userProduct);


// router
//   .route("/app/api/v1/user/update-profile")
//   .post(authenticateJWT(), userController.updateUserProfile);

module.exports = router;
