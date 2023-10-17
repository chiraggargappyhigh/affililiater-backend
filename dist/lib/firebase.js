"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const path_1 = __importDefault(require("path"));
const serviceAccountPath = path_1.default.join(__dirname, "..", "secrets", "firebase-admin.json");
const firebaseApp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccountPath),
});
const auth = (0, auth_1.getAuth)(firebaseApp);
exports.auth = auth;
