"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateMiddleware = exports.ProductMiddleware = exports.AuthMiddleware = void 0;
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
exports.AuthMiddleware = auth_middleware_1.default;
const product_middleware_1 = __importDefault(require("./product.middleware"));
exports.ProductMiddleware = product_middleware_1.default;
const affiliate_middleware_1 = __importDefault(require("./affiliate.middleware"));
exports.AffiliateMiddleware = affiliate_middleware_1.default;
