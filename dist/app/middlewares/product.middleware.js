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
const yup_1 = require("yup");
class ProductMiddleware {
    verifyProductData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            try {
                const schema = (0, yup_1.object)({
                    name: (0, yup_1.string)().required(),
                    description: (0, yup_1.string)().required(),
                    stripeKey: (0, yup_1.string)().required(),
                    urls: (0, yup_1.object)({
                        home: (0, yup_1.string)().required(),
                        privacyPolicy: (0, yup_1.string)().required(),
                        termsOfService: (0, yup_1.string)().required(),
                    }),
                });
                const validatedData = yield schema.validate(data);
                req.body = Object.assign(Object.assign({}, req.body), { data: validatedData });
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ProductMiddleware;
