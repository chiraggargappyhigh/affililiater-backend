import { ENV, Config, NODE_ENV } from "../interfaces/env.interface";

const verifyEnv = (env: ENV): Config => {
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
      if (!Object.values(NODE_ENV).includes(value as NODE_ENV)) {
        throw new Error("node_env is not a valid value");
      }
    }
  });

  return env as Config;
};

export default verifyEnv;
