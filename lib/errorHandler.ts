import { Request, Response, NextFunction } from "express";
import { ERRORS } from "../constants/errors";
import { config } from "../config";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  const { message } = error;
  const errData = ERRORS[message as keyof typeof ERRORS];
  if (!errData) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: {
        message: "Internal server error",
      },
    });
    return;
  }
  const statusCode = errData?.status || 500;
  if (config.node_env === "development" || config.node_env === "test") {
    console.log(error);
  }
  res.status(statusCode).json({
    status: "error",
    data: errData,
  });
};

export default errorHandler;
