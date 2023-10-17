"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const config_1 = require("./config");
const mongo_1 = require("./lib/mongo");
const morgan_1 = __importDefault(require("morgan"));
const env_interface_1 = require("./interfaces/env.interface");
const routes_1 = __importDefault(require("./app/routes"));
const redirect_routes_1 = __importDefault(require("./app/routes/redirect.routes"));
const errorHandler_1 = __importDefault(require("./lib/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
if (config_1.config.node_env === env_interface_1.NODE_ENV.development) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined"));
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
app.use("/share", redirect_routes_1.default.publicShareRouter);
app.use(errorHandler_1.default);
const server = (0, http_1.createServer)(app);
(0, mongo_1.connectToDB)()
    .then(() => {
    console.log("Connected to database");
    server.listen(config_1.config.port, () => {
        console.log(`Server listening on port ${config_1.config.port}`);
    });
})
    .catch((err) => {
    console.log(err);
    process.exit(1);
});
