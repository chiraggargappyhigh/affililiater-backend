"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectController = exports.TransactionController = exports.AffiliateController = exports.ProductController = exports.UserController = void 0;
const user_controller_1 = __importDefault(require("./user.controller"));
exports.UserController = user_controller_1.default;
const product_controller_1 = __importDefault(require("./product.controller"));
exports.ProductController = product_controller_1.default;
const affiliate_controller_1 = __importDefault(require("./affiliate.controller"));
exports.AffiliateController = affiliate_controller_1.default;
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
exports.TransactionController = transaction_controller_1.default;
const redirect_controller_1 = __importDefault(require("./redirect.controller"));
exports.RedirectController = redirect_controller_1.default;
