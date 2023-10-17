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
class ProductController {
    constructor() {
        this.productService = new services_1.ProductService();
        this.userService = new services_1.UserService();
        this.create = this.create.bind(this);
        this.addDefaultConfig = this.addDefaultConfig.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.updateMember = this.updateMember.bind(this);
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, user } = req.body;
            try {
                console.log("data", data);
                console.log("user", user);
                const product = yield this.productService.create(data, user._id, user.email);
                res.status(201).json({
                    status: "success",
                    message: "Product created successfully",
                    product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addDefaultConfig(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = req.body;
            const { id: productId } = req.params;
            try {
                const product = yield this.productService.update(productId, {
                    defaultConfig: data,
                });
                res.status(200).json({
                    status: "success",
                    message: "Product default config updated successfully",
                    product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    read(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: productId } = req.params;
            try {
                const product = yield this.productService.getProduct(productId);
                res.status(200).json({
                    status: "success",
                    message: "Product found",
                    product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productService.list();
                res.status(200).json({
                    status: "success",
                    message: "Products found",
                    products,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { users: userData }, } = req.body;
            const { id: productId } = req.params;
            try {
                const members = yield Promise.all(userData.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const userId = yield this.userService.getIdByEmail(user.email);
                    return {
                        user: userId,
                        role: user.role,
                        permissions: user.permissions,
                    };
                })));
                const product = yield this.productService.addMembers(productId, members);
                res.status(200).json({
                    status: "success",
                    message: "Product member added successfully",
                    product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: { role, permissions, memberId }, } = req.body;
            const { id: productId } = req.params;
            try {
                const product = yield this.productService.updateMembers(productId, {
                    role,
                    permissions,
                    userId: memberId,
                });
                res.status(200).json({
                    status: "success",
                    message: "Product member updated successfully",
                    product,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ProductController;
