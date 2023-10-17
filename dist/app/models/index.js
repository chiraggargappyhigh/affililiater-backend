"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectModel = exports.TransactionModel = exports.ProductModel = exports.AssetModel = exports.UserModel = exports.AffiliateModel = void 0;
const affiliate_model_1 = __importDefault(require("./affiliate.model"));
exports.AffiliateModel = affiliate_model_1.default;
const user_model_1 = __importDefault(require("./user.model"));
exports.UserModel = user_model_1.default;
const asset_model_1 = __importDefault(require("./asset.model"));
exports.AssetModel = asset_model_1.default;
const product_model_1 = __importDefault(require("./product.model"));
exports.ProductModel = product_model_1.default;
const transaction_model_1 = __importDefault(require("./transaction.model"));
exports.TransactionModel = transaction_model_1.default;
const redirect_model_1 = __importDefault(require("./redirect.model"));
exports.RedirectModel = redirect_model_1.default;
