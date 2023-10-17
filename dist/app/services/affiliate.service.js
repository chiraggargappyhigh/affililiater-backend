"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const product_service_1 = __importDefault(require("./product.service"));
const stripe_1 = __importDefault(require("stripe"));
class AffiliateService {
    constructor() {
        this.affiliateModel = models_1.AffiliateModel;
        this.productService = new product_service_1.default();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.getAffiliateByCode = this.getAffiliateByCode.bind(this);
        this.getRedirectLink = this.getRedirectLink.bind(this);
        this.createExtraLink = this.createExtraLink.bind(this);
        this.deleteExtraLink = this.deleteExtraLink.bind(this);
        this.readUserAffiliate = this.readUserAffiliate.bind(this);
        this.listUserAffiliates = this.listUserAffiliates.bind(this);
        this.createPromotionalUrl = this.createPromotionalUrl.bind(this);
        this.createStripeCode = this.createStripeCode.bind(this);
    }
    createStripeCode(key, codeConfig, user, stripeProductIds) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const stripe = new stripe_1.default(key, {
                apiVersion: "2023-08-16",
            });
            const coupon = yield stripe.coupons.create({
                percent_off: codeConfig.couponDiscount,
                duration: "once",
                name: `${user.name}'s Affiliate ${codeConfig.couponDiscount}% off`,
                applies_to: {
                    products: stripeProductIds,
                },
            });
            let code = null;
            const { generate } = yield Promise.resolve().then(() => __importStar(require("referral-codes")));
            for (let i = 0; i < 10; i++) {
                const newCode = generate({
                    length: 6,
                    count: 1,
                    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
                    prefix: (_b = (_a = user.name) === null || _a === void 0 ? void 0 : _a.substring(0, 4)) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                });
                try {
                    const existingCode = yield this.affiliateModel.findOne({
                        "promotionDetails.code": newCode,
                    });
                    if (existingCode) {
                        continue;
                    }
                    code = yield stripe.promotionCodes.create({
                        coupon: coupon.id,
                        code: newCode[0],
                        restrictions: {
                            first_time_transaction: true,
                        },
                    });
                    break;
                }
                catch (error) {
                    console.log(error);
                    continue;
                }
            }
            if (!code) {
                throw new Error("Could not create code");
            }
            return {
                code: code.code,
                codeId: code.id,
            };
        });
    }
    createPromotionalUrl(prefix) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let link = null;
            const { generate } = yield Promise.resolve().then(() => __importStar(require("referral-codes")));
            for (let i = 0; i < 10; i++) {
                const uniqueId = generate({
                    length: 10,
                    count: 1,
                    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
                    prefix: ((_a = prefix === null || prefix === void 0 ? void 0 : prefix.substring(0, 4)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "",
                });
                link = `${uniqueId}`;
                const existingLink = yield this.affiliateModel.findOne({
                    $or: [
                        {
                            "promotionDetails.defaultLink": link,
                        },
                        {
                            "promotionDetails.extraLinks": link,
                        },
                    ],
                });
                if (existingLink) {
                    continue;
                }
            }
            if (!link) {
                throw new Error("Could not create link");
            }
            return link;
        });
    }
    create(productId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productService.getProduct(productId);
            const stripeProductIds = Object.keys(product.defaultConfig.commissions).map((key) => key.toString());
            const existingAffiliate = yield this.affiliateModel.findOne({
                product: productId,
                user: user._id,
            });
            if (existingAffiliate) {
                return {
                    affiliate: existingAffiliate,
                    product,
                };
            }
            const { code, codeId } = yield this.createStripeCode(product.stripeKey, product.defaultConfig, user, stripeProductIds);
            const newAffiliate = new this.affiliateModel({
                product: productId,
                user: user._id,
                config: product.defaultConfig,
                promotionDetails: {
                    code,
                    codeId,
                    defaultLink: yield this.createPromotionalUrl(productId),
                },
            });
            yield newAffiliate.save();
            return {
                affiliate: newAffiliate,
                product,
            };
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedAffiliate = yield this.affiliateModel.findByIdAndUpdate(id, data, {
                new: true,
            });
            if (!updatedAffiliate) {
                throw new Error("Affiliate not found");
            }
            return updatedAffiliate;
        });
    }
    createExtraLink(id, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield this.affiliateModel.findById(id);
            if (!affiliate) {
                throw new Error("Affiliate not found");
            }
            const existingLinkCount = affiliate.promotionDetails.extraLinks.length;
            if (existingLinkCount >= 5) {
                throw new Error("Maximum number of links reached");
            }
            const link = yield this.createPromotionalUrl(prefix);
            affiliate.promotionDetails.extraLinks.push(link);
            yield affiliate.save();
            return affiliate;
        });
    }
    deleteExtraLink(id, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield this.affiliateModel.findByIdAndUpdate(id, {
                $pull: {
                    "promotionDetails.extraLinks": link,
                },
            }, {
                new: true,
            });
            if (!affiliate) {
                throw new Error("Affiliate not found");
            }
            return affiliate;
        });
    }
    getAffiliateByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield this.affiliateModel.findOne({
                "promotionDetails.codeId": code,
            });
            if (!affiliate) {
                throw new Error("Affiliate not found");
            }
            return affiliate;
        });
    }
    getRedirectLink(link, code) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("link", link);
            const affiliate = yield this.affiliateModel
                .findOne({
                $or: [
                    {
                        "promotionDetails.defaultLink": link,
                    },
                    {
                        "promotionDetails.extraLinks": link,
                    },
                ],
            })
                .populate("product")
                .select("product user");
            if (!affiliate) {
                throw new Error("Affiliate not found");
            }
            const product = affiliate.product;
            const redirectLink = product.urls.redirect;
            let returnObj = {
                productId: product._id,
                userId: affiliate.user,
            };
            if (!code) {
                returnObj.redirectUrl = redirectLink.replace("{{CODE}}", "");
                return returnObj;
            }
            returnObj.redirectUrl = redirectLink.replace("{{CODE}}", code);
            return returnObj;
        });
    }
    readUserAffiliate(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield this.affiliateModel
                .findOne({ user: userId, product: productId })
                .populate("product")
                .select("-promotionDetails.codeId");
            if (!affiliate) {
                throw new Error("Affiliate not found");
            }
            return affiliate;
        });
    }
    listUserAffiliates(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliates = yield this.affiliateModel
                .find({ user: userId })
                .populate("product", "name description logo _id")
                .select("-promotionDetails.codeId");
            if (!affiliates) {
                throw new Error("Affiliates not found");
            }
            return affiliates;
        });
    }
}
exports.default = AffiliateService;
