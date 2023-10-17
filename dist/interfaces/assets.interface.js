"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetThemeValues = exports.AssetTheme = exports.AssetTypeValues = exports.AssetType = void 0;
var AssetType;
(function (AssetType) {
    AssetType[AssetType["IMAGE"] = 0] = "IMAGE";
    AssetType[AssetType["VIDEO"] = 1] = "VIDEO";
    AssetType[AssetType["WEB_EMBED"] = 2] = "WEB_EMBED";
    AssetType[AssetType["TEXT"] = 3] = "TEXT";
})(AssetType || (exports.AssetType = AssetType = {}));
var AssetTheme;
(function (AssetTheme) {
    AssetTheme[AssetTheme["ALL"] = -1] = "ALL";
    AssetTheme[AssetTheme["LIGHT"] = 0] = "LIGHT";
    AssetTheme[AssetTheme["DARK"] = 1] = "DARK";
})(AssetTheme || (exports.AssetTheme = AssetTheme = {}));
const AssetTypeValues = Object.values(AssetType).filter((value) => typeof value === "number");
exports.AssetTypeValues = AssetTypeValues;
const AssetThemeValues = Object.values(AssetTheme).filter((value) => typeof value === "number");
exports.AssetThemeValues = AssetThemeValues;
