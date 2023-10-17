"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env_util_1 = __importDefault(require("../utils/env.util"));
dotenv_1.default.config({
    path: ".env.local",
});
const env = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    mongo_uri: process.env.MONGO_URI,
    cryptoSecret: process.env.CRYPTO_SECRET,
};
const config = (0, env_util_1.default)(env);
exports.default = config;
