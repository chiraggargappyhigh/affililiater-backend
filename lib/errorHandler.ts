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
  res.status(500).json({
    status: "error",
    message,
  });
  // const errData = ERRORS[message as keyof typeof ERRORS];
  // const statusCode = errData?.statusCode || 500;
  // if (config.env === "development") {
  //   console.log(error);
  // } else {
  //   delete errData?.developerMessage;
  //   delete errData?.errorCode;
  // }
  // res.status(statusCode).json({
  //   status: "error",
  //   data: errData,
  // });
};

export default errorHandler;
