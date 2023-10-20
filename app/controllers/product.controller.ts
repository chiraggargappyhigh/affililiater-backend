import { Request, Response, NextFunction } from "express";
import { ProductService, UserService } from "../services";
import {
  Product,
  ProductPermission,
  ProductRole,
  UserDocument,
} from "../../interfaces";

class ProductController {
  private productService: ProductService;
  private userService: UserService;
  constructor() {
    this.productService = new ProductService();
    this.userService = new UserService();
    this.create = this.create.bind(this);
    this.addDefaultConfig = this.addDefaultConfig.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.updateMember = this.updateMember.bind(this);
    this.read = this.read.bind(this);
    this.list = this.list.bind(this);
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const { data, user } = req.body as {
      data: Partial<Product>;
      user: UserDocument;
    };
    try {
      console.log("data", data);
      console.log("user", user);
      const product = await this.productService.create(
        data,
        user._id,
        user.email
      );
      res.status(201).json({
        status: "success",
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addDefaultConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { data } = req.body as {
      data: Product["defaultConfig"];
    };
    const { id: productId } = req.params;
    try {
      const product = await this.productService.update(productId, {
        defaultConfig: data,
      });
      res.status(200).json({
        status: "success",
        message: "Product default config updated successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async read(req: Request, res: Response, next: NextFunction) {
    const { id: productId } = req.params;
    try {
      const product = await this.productService.read(productId);
      console.log("product", product);
      res.status(200).json({
        status: "success",
        message: "Product found",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.list();
      res.status(200).json({
        status: "success",
        message: "Products found",
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addMembers(req: Request, res: Response, next: NextFunction) {
    const {
      data: { users: userData },
    } = req.body as {
      data: {
        users: {
          email: string;
          role: ProductRole;
          permissions: ProductPermission[];
        }[];
      };
    };
    const { id: productId } = req.params;
    try {
      const members = await Promise.all(
        userData.map(async (user) => {
          const userId = await this.userService.getIdByEmail(user.email);
          return {
            user: userId,
            role: user.role,
            permissions: user.permissions,
          };
        })
      );
      const product = await this.productService.addMembers(productId, members);
      res.status(200).json({
        status: "success",
        message: "Product member added successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateMember(req: Request, res: Response, next: NextFunction) {
    const {
      data: { role, permissions, memberId },
    } = req.body as {
      data: {
        role: ProductRole;
        permissions: ProductPermission[];
        memberId: string;
      };
    };
    const { id: productId } = req.params;
    try {
      const product = await this.productService.updateMembers(productId, {
        role,
        permissions,
        userId: memberId,
      });
      res.status(200).json({
        status: "success",
        message: "Product member updated successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
