"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionStatusValues = void 0;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["Created"] = 0] = "Created";
    TransactionStatus[TransactionStatus["REDEEMABLE"] = 1] = "REDEEMABLE";
    TransactionStatus[TransactionStatus["REDEEMED"] = 2] = "REDEEMED";
    TransactionStatus[TransactionStatus["REFUNDED"] = 3] = "REFUNDED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
const TransactionStatusValues = Object.values(TransactionStatus).filter((value) => typeof value === "number");
exports.TransactionStatusValues = TransactionStatusValues;
