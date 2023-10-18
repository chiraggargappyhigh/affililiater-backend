import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { UserType, UserDocument, UserLoginMethod } from "../../interfaces";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();

    this.login = this.login.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
    this.getLoginMethod = this.getLoginMethod.bind(this);
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken, userType, loginMethod, userName } = req.body as {
        idToken: string;
        userType?: UserType;
        loginMethod?: UserLoginMethod;
        userName?: string;
      };
      const user = await this.userService.create(
        idToken,
        userType,
        loginMethod,
        userName
      );
      if (!user) {
        res.status(400).json({
          status: "error",
          message: "User not found",
        });
        return;
      }
      const accessToken = this.userService.generateAccessToken(user);
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        user,
        accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        data,
        user: { _id: id },
      } = req.body as { data: Partial<UserDocument>; user: UserDocument };

      const user = await this.userService.update(id, {
        $set: data,
      });
      if (!user) throw new Error("User not found");
      const accessToken = this.userService.generateAccessToken(user);
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user,
        accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async read(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user: { _id: id },
      } = req.body as { user: UserDocument };

      const user = await this.userService.read(id);
      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        user,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user: { _id: id },
      } = req.body as { user: UserDocument };

      const user = await this.userService.read(id);
      const accessToken = this.userService.generateAccessToken(user);
      res.status(200).json({
        status: "success",
        message: "Tokens refreshed successfully ",
        accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getLoginMethod(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;
    try {
      const loginMethod = await this.userService.getLoginMethod(email);
      res.status(200).json({
        status: "success",
        message: "Login method retrieved successfully",
        loginMethod,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserController;
