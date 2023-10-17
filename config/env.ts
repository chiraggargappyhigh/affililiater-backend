import dotenv from "dotenv";
import verifyEnv from "../utils/env.util";
import { ENV, Config, NODE_ENV } from "../interfaces/env.interface";

dotenv.config({
  path: ".env.local",
});

const env: ENV = {
  node_env: process.env.NODE_ENV as NODE_ENV,
  port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  mongo_uri: process.env.MONGO_URI,
  cryptoSecret: process.env.CRYPTO_SECRET,
};

const config: Config = verifyEnv(env);

export default config;
