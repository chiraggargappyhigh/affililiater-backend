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
exports.FirebaseService = void 0;
const firebase_1 = require("../../lib/firebase");
class FirebaseService {
    constructor() {
        this.auth = firebase_1.auth;
        this.getUserByIdToken = this.getUserByIdToken.bind(this);
        this.getUserByFirebaseUid = this.getUserByFirebaseUid.bind(this);
    }
    getUserByIdToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this.auth.verifyIdToken(idToken);
            const user = yield this.getUserByFirebaseUid(decodedToken.uid);
            return user;
        });
    }
    getUserByFirebaseUid(firebaseUid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.auth.getUser(firebaseUid);
            return {
                firebaseUid: user.uid,
                email: user.email,
                name: user.displayName || null,
                photoUrl: user.photoURL,
            };
        });
    }
}
exports.FirebaseService = FirebaseService;
exports.default = FirebaseService;
