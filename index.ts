import express from "express";
import { createServer } from "http";
import { config } from "./config";
import { connectToDB } from "./lib/mongo";
import morgan from "morgan";
import { NODE_ENV } from "./interfaces/env.interface";
import Router from "./app/routes";
import RedirectRouter from "./app/routes/redirect.routes";
import errorHandler from "./lib/errorHandler";
import cors from "cors";

const app = express();

if (config.node_env === NODE_ENV.development) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", Router);
app.use("/share", RedirectRouter.publicShareRouter);

app.use(errorHandler);
const server = createServer(app);

connectToDB()
  .then(() => {
    console.log("Connected to database");
    server.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
