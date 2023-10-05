/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
global.__basedir = __dirname;
require("./config/db");
const app = express();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
let logger = require("morgan");

//all routes
const customJson = (req, res, next) => {
  if (req.originalUrl.includes("/stripe")) {
    next();
  } else {
    express.json({ limit: "100MB" })(req, res, next);
  }
};
const routes = require("./routes");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(customJson);
app.use(routes);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () => {
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
