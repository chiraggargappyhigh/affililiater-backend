import mongoose from "mongoose";
import { config } from "../config";

const connectToDB = () => {
  return mongoose.connect(config.mongo_uri);
};

export { connectToDB };
