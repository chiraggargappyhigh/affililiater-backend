"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const affiliate_routes_1 = __importDefault(require("./affiliate.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const redirect_routes_1 = __importDefault(require("./redirect.routes"));
const router = (0, express_1.Router)();
router.use("/user", user_routes_1.default);
router.use("/product", product_routes_1.default);
router.use("/affiliate", affiliate_routes_1.default);
router.use("/transaction", transaction_routes_1.default);
router.use("/redirect", redirect_routes_1.default.router);
exports.default = router;
