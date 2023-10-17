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
const affiliate_service_1 = __importDefault(require("./affiliate.service"));
class RedirectService {
    constructor() {
        this.RedirectModel = models_1.RedirectModel;
        this.affiliateService = new affiliate_service_1.default();
        this.create = this.create.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, referredFrom, referredTo, user, product } = data;
            const redirect = yield this.RedirectModel.create({
                user,
                product,
                referredFrom,
                referredTo,
                codeApplied: code,
            });
            return redirect;
        });
    }
    handleRedirect(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            const referrer = req.headers.referrer || req.headers.referer || "unknown";
            const { code } = req.query;
            const { userId, productId, redirectUrl } = yield this.affiliateService.getRedirectLink(id, code);
            yield this.create({
                code: code,
                referredFrom: referrer,
                referredTo: id,
                user: userId,
                product: productId,
            });
            if (code) {
                return redirectUrl.replace("{{code}}", code);
            }
            return redirectUrl.replace("{{code}}", "");
        });
    }
}
exports.default = RedirectService;
