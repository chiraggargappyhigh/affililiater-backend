"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductPermissionValues = exports.ProductPermission = exports.ProductRoleValues = exports.ProductRole = void 0;
var ProductRole;
(function (ProductRole) {
    ProductRole[ProductRole["ADMIN"] = 0] = "ADMIN";
    ProductRole[ProductRole["MEMBER"] = 1] = "MEMBER";
})(ProductRole || (exports.ProductRole = ProductRole = {}));
var ProductPermission;
(function (ProductPermission) {
    ProductPermission[ProductPermission["READ"] = 0] = "READ";
    ProductPermission[ProductPermission["WRITE"] = 1] = "WRITE";
    ProductPermission[ProductPermission["DELETE"] = 2] = "DELETE";
})(ProductPermission || (exports.ProductPermission = ProductPermission = {}));
const ProductRoleValues = Object.values(ProductRole).filter((value) => typeof value === "number");
exports.ProductRoleValues = ProductRoleValues;
const ProductPermissionValues = Object.values(ProductPermission).filter((value) => typeof value === "number");
exports.ProductPermissionValues = ProductPermissionValues;
