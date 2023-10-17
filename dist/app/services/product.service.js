"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const interfaces_1 = require("../../interfaces");
const aes_1 = __importDefault(require("crypto-js/aes"));
const config_1 = require("../../config");
const stripe_1 = __importDefault(require("stripe"));
class ProductService {
    constructor() {
        this.ProductModel = models_1.ProductModel;
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.read = this.read.bind(this);
        this.list = this.list.bind(this);
        this.hasAccess = this.hasAccess.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.updateMembers = this.updateMembers.bind(this);
        this.populateStripeProducts = this.populateStripeProducts.bind(this);
        this.getProduct = this.getProduct.bind(this);
    }
    populateStripeProducts(commissions, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedKey = aes_1.default.decrypt(key, config_1.config.cryptoSecret).toString();
            const stripe = new stripe_1.default(decodedKey, {
                apiVersion: "2023-08-16",
            });
            const products = yield stripe.products.list({
                ids: Object.keys(commissions),
            });
            const data = products.data.map((product) => __awaiter(this, void 0, void 0, function* () {
                const stripePrices = (yield stripe.prices.list({
                    product: product.id,
                    active: true,
                })).data;
                const prices = yield stripePrices.map((price) => {
                    var _a, _b;
                    let returnObj = {};
                    if (price.recurring) {
                        returnObj.interval = `${(_a = price.recurring) === null || _a === void 0 ? void 0 : _a.interval_count}_${(_b = price.recurring) === null || _b === void 0 ? void 0 : _b.interval}`;
                    }
                    if (price.currency_options) {
                        for (let [key, value] of Object.entries(price.currency_options)) {
                            returnObj.prices[key.toUpperCase()] = Number(((value === null || value === void 0 ? void 0 : value.unit_amount) / 100).toFixed(2));
                        }
                    }
                    else {
                        returnObj.prices[price.currency.toUpperCase()] = Number((price.unit_amount / 100).toFixed(2));
                    }
                    return returnObj;
                });
                return {
                    name: product.name,
                    description: product.description,
                    image: product.images[0],
                    interval: prices[0].interval,
                    prices: prices[0].prices,
                    commission: commissions[product.id],
                };
            }));
            return yield Promise.all(data);
        });
    }
    create(data, userId, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = new this.ProductModel(Object.assign(Object.assign({}, data), { members: [
                    {
                        user: userId,
                        role: interfaces_1.ProductRole.ADMIN,
                        permissions: interfaces_1.ProductPermissionValues,
                    },
                ], contactEmail: userEmail, stripeKey: data.stripeKey }));
            return yield newProduct.save();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProduct = yield this.ProductModel.findByIdAndUpdate(id, data, {
                new: true,
            });
            return updatedProduct;
        });
    }
    addMembers(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.ProductModel.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }
            product.members.push(...data);
            return yield product.save();
        });
    }
    updateMembers(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.ProductModel.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }
            const memberIndex = product.members.findIndex((member) => member.user === data.userId);
            if (memberIndex === -1) {
                throw new Error("Member not found");
            }
            product.members[memberIndex].role = data.role;
            product.members[memberIndex].permissions = data.permissions;
            return product.save();
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = (yield this.ProductModel.findById(id));
            const stripeProducts = yield this.populateStripeProducts(product.defaultConfig.commissions, product.stripeKey);
            product.stripeProducts = stripeProducts;
            return product;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.ProductModel.find()
                .lean()
                .select("-members -stripeKey -urls.redirect -defaultConfig");
            const data = products.map((product) => __awaiter(this, void 0, void 0, function* () {
                const stripeProducts = yield this.populateStripeProducts(product.defaultConfig.commissions, product.stripeKey);
                product.stripeProducts = stripeProducts;
                return product;
            }));
            return yield Promise.all(data);
        });
    }
    hasAccess(userId, productId, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.ProductModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            const member = product.members.find((member) => member.user === userId);
            if (!member) {
                throw new Error("Member not found");
            }
            const hasAccess = member.permissions.some((permission) => permissions.includes(permission));
            return hasAccess;
        });
    }
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = (yield this.ProductModel.findById(productId).lean());
            return product;
        });
    }
}
exports.default = ProductService;
