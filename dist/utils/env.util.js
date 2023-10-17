"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_interface_1 = require("../interfaces/env.interface");
const verifyEnv = (env) => {
    Object.entries(env).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`${key} is not defined`);
        }
        if (key === "port") {
            const port = parseInt(value, 10);
            if (isNaN(port)) {
                throw new Error("port is not a number");
            }
        }
        if (key === "node_env") {
            console.log(value);
            if (!Object.values(env_interface_1.NODE_ENV).includes(value)) {
                throw new Error("node_env is not a valid value");
            }
        }
    });
    return env;
};
exports.default = verifyEnv;
