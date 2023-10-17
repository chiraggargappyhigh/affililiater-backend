import { Request, Response, NextFunction } from "express";
import jwr from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { UserModel } from "../models";
import { UserDocument, UserType } from "../../interfaces";
import { TokenError, UserError } from "../../constants/errors";
class AuthMiddleware {
  private UserModel: typeof UserModel;
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.UserModel = UserModel;
    this.privateKey = fs
      .readFileSync(path.join(__dirname, "..", "..", "secrets", "private.pem"))
      .toString();
    this.publicKey = fs
      .readFileSync(path.join(__dirname, "..", "..", "secrets", "public.pem"))
      .toString();

    this.authenticate = this.authenticate.bind(this);
    this.authorize = this.authorize.bind(this);
    this.authenticatePublicWebhook = this.authenticatePublicWebhook.bind(this);
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new Error(TokenError.TOKEN_NOT_FOUND);
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        throw new Error(TokenError.TOKEN_NOT_FOUND);
      }

      const decoded = jwr.verify(token, this.publicKey);
      if (!decoded || typeof decoded === "string" || !decoded?.id) {
        throw new Error(TokenError.INVALID_TOKEN);
      }
      const user = await this.UserModel.findById(decoded.id);
      if (!user) {
        throw new Error(UserError.USER_NOT_FOUND);
      }

      if (!["GET, DELETE"].includes(req.method)) {
        req.body = {
          data: req.body,
          user,
        };
      } else {
        req.body = {
          user,
        };
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  public async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body as { user: UserDocument; [key: string]: any };
      if (user.userType !== UserType.ADMIN) {
        throw new Error(UserError.USER_NOT_ADMIN);
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  public async authenticatePublicWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new Error(TokenError.TOKEN_NOT_FOUND);
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        throw new Error(TokenError.TOKEN_NOT_FOUND);
      }

      const decoded = jwr.verify(token, this.publicKey, {
        ignoreExpiration: true,
      });
      if (!decoded) {
        throw new Error(TokenError.INVALID_TOKEN);
      }

      req.body = {
        data: req.body,
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  public async blockRequestsFroBrowser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userAgent = req.headers["user-agent"];
    if (!userAgent) {
      // request is not from a browser
      return next();
    } else {
      // request is from a browser
      return res.status(403).json({
        status: "error",
        message: "You are not allowed to access this resource from a browser",
      });
    }
  }
}

export default AuthMiddleware;
