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
class TransactionController {
    constructor() {
        this.transactionService = new services_1.TransactionService();
        this.create = this.create.bind(this);
        this.refund = this.refund.bind(this);
        this.listByUser = this.listByUser.bind(this);
        this.listByProduct = this.listByProduct.bind(this);
        this.listByAffiliate = this.listByAffiliate.bind(this);
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            console.log(data);
            try {
                const transaction = yield this.transactionService.create(data);
                res.status(201).json({
                    status: "success",
                    message: "Transaction created successfully",
                    transaction,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    refund(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            try {
                const transaction = yield this.transactionService.refund(data.paymentIntentId);
                res.status(200).json({
                    status: "success",
                    message: "Transaction refunded successfully",
                    transaction,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listByUser(req, res, next) {
        const { user } = req.body;
        try {
            const transactions = this.transactionService.listByUser(user._id);
            res.status(200).json({
                status: "success",
                message: "Transactions retrieved successfully",
                transactions,
            });
        }
        catch (error) {
            next(error);
        }
    }
    listByProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            try {
                const transactions = yield this.transactionService.listByProduct(productId);
                res.status(200).json({
                    status: "success",
                    message: "Transactions retrieved successfully",
                    transactions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listByAffiliate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const { user } = req.body;
            const { l, p } = req.query;
            try {
                const transactions = yield this.transactionService.listByAffiliate(user._id, productId, l, p);
                res.status(200).json({
                    status: "success",
                    message: "Transactions retrieved successfully",
                    transactions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TransactionController;
