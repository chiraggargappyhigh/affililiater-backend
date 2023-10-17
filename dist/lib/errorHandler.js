"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    console.log(error);
    const { message } = error;
    res.status(500).json({
        status: "error",
        message,
    });
};
exports.default = errorHandler;
