"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const publicShareRouter = (0, express_1.Router)();
const redirectController = new controllers_1.RedirectController();
publicShareRouter.get("/:id", redirectController.handleRedirect);
exports.default = {
    publicShareRouter,
    router,
};
