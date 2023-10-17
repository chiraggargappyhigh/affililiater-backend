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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class AffiliateController {
    constructor() {
        this.affiliateService = new services_1.AffiliateService();
        this.create = this.create.bind(this);
        this.readUserAffiliate = this.readUserAffiliate.bind(this);
        this.listUserAffiliates = this.listUserAffiliates.bind(this);
        this.addPayoutDetails = this.addPayoutDetails.bind(this);
        this.createExtraLink = this.createExtraLink.bind(this);
        this.deleteExtraLink = this.deleteExtraLink.bind(this);
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { productId }, user, } = req.body;
                const { affiliate, product } = yield this.affiliateService.create(productId, user);
                res.status(201).json({
                    status: "success",
                    message: `You're now an affiliate for ${product.name}!`,
                    affiliate,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addPayoutDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            const { id: affiliateId } = req.params;
            try {
                const affiliate = yield this.affiliateService.update(affiliateId, {
                    $set: {
                        payout: Object.assign(Object.assign({}, data), { paypalEmail: data.paypalEmail }),
                    },
                });
                res.status(200).json({
                    status: "success",
                    message: "Affiliate payout details updated successfully",
                    data: affiliate,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    readUserAffiliate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                const { productId } = req.params;
                const affiliate = yield this.affiliateService.readUserAffiliate(user._id, productId);
                res.status(200).json({
                    status: "success",
                    message: "Affiliate found",
                    data: affiliate,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listUserAffiliates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                const affiliates = yield this.affiliateService.listUserAffiliates(user._id);
                res.status(200).json({
                    status: "success",
                    message: "Affiliates found",
                    data: affiliates,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createExtraLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { affiliateId } = req.params;
                const { prefix } = req.query;
                const affiliate = yield this.affiliateService.createExtraLink(affiliateId, prefix);
                res.status(200).json({
                    status: "success",
                    message: "Affiliate found",
                    data: affiliate.promotionDetails.extraLinks,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteExtraLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { affiliateId } = req.params;
                const { link } = req.query;
                if (!link)
                    throw new Error("Link is required");
                const affiliate = yield this.affiliateService.deleteExtraLink(affiliateId, link);
                res.status(200).json({
                    status: "success",
                    message: "Affiliate found",
                    data: affiliate.promotionDetails.extraLinks,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AffiliateController;
