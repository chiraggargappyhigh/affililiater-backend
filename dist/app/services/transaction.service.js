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
const interfaces_1 = require("../../interfaces");
const models_1 = require("../models");
const affiliate_service_1 = __importDefault(require("./affiliate.service"));
const user_service_1 = __importDefault(require("./user.service"));
const easy_currencies_1 = require("easy-currencies");
class TransactionService {
    constructor() {
        this.transactionModel = models_1.TransactionModel;
        this.affiliateService = new affiliate_service_1.default();
        this.userService = new user_service_1.default();
        this.create = this.create.bind(this);
        this.refund = this.refund.bind(this);
        this.listByUser = this.listByUser.bind(this);
        this.listByProduct = this.listByProduct.bind(this);
        this.listByAffiliate = this.listByAffiliate.bind(this);
    }
    create(transactionPayload) {
        return __awaiter(this, void 0, void 0, function* () {
            const affiliate = yield this.affiliateService.getAffiliateByCode(transactionPayload.code);
            const commissionPercent = affiliate.config.commissions[transactionPayload.stripeProductId];
            const commissionInCurrency = (transactionPayload.sale.amount * commissionPercent) / 10000;
            const saleInUsd = yield (0, easy_currencies_1.Convert)(transactionPayload.sale.amount / 100)
                .from(transactionPayload.sale.currency.toUpperCase())
                .to("USD");
            const commission = (saleInUsd * commissionPercent) / 100;
            const newTransaction = new this.transactionModel({
                user: affiliate.user,
                product: affiliate.product,
                stripeProductId: transactionPayload.stripeProductId,
                paymentIntentId: transactionPayload.paymentIntentId,
                sale: {
                    amount: transactionPayload.sale.amount / 100,
                    currency: transactionPayload.sale.currency,
                },
                codeUsed: transactionPayload.code,
                commission: {
                    amount: commissionInCurrency,
                    amountInUsd: commission,
                    percent: commissionPercent,
                },
            });
            yield newTransaction.save();
            affiliate.earnings += commission;
            affiliate.referrals += 1;
            affiliate.sales += saleInUsd;
            affiliate.payment.inBuffer += commission;
            yield affiliate.save();
            yield this.userService.update(affiliate.user, {
                $inc: {
                    totalEarnings: commission,
                    totalReferrals: 1,
                    totalSales: saleInUsd,
                },
            });
            return newTransaction;
        });
    }
    refund(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.transactionModel.findOne({
                paymentIntentId,
            });
            if (!transaction)
                throw new Error("Transaction not found");
            const affiliate = yield this.affiliateService.getAffiliateByCode(transaction.codeUsed);
            const saleInUsd = yield (0, easy_currencies_1.Convert)(transaction.sale.amount)
                .from(transaction.sale.currency.toUpperCase())
                .to("USD");
            affiliate.earnings -= transaction.commission.amountInUsd;
            affiliate.sales -= saleInUsd;
            affiliate.refunds += saleInUsd;
            affiliate.payment.inBuffer -= transaction.commission.amountInUsd;
            yield affiliate.save();
            yield this.userService.update(affiliate.user, {
                $inc: {
                    totalEarnings: -transaction.commission.amountInUsd,
                    totalSales: -saleInUsd,
                    totalRefunds: saleInUsd,
                },
            });
            transaction.status = interfaces_1.TransactionStatus.REFUNDED;
            yield transaction.save();
            return transaction;
        });
    }
    listByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.transactionModel
                .find({ user: userId })
                .populate("product");
            return transactions;
        });
    }
    listByProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.transactionModel
                .find({ product: productId })
                .populate("user");
            return transactions;
        });
    }
    listByAffiliate(userId, productId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let l, p;
            if (limit) {
                l = parseInt(limit);
            }
            else {
                l = 10;
            }
            if (page) {
                p = parseInt(page);
            }
            else {
                p = 1;
            }
            const transactions = yield this.transactionModel
                .find({
                user: userId,
                product: productId,
            })
                .skip(l * p - l)
                .limit(l)
                .select("codeUsed sale commission createdAt status -_id");
            return transactions;
        });
    }
}
exports.default = TransactionService;
