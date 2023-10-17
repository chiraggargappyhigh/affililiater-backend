import { Request, Response, NextFunction } from "express";
import {
  Product,
  ProductPermission,
  ProductRole,
  UserDocument,
} from "../../interfaces";
import { object, string } from "yup";

class ProductMiddleware {
  public async verifyProductData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { data } = req.body as {
      data: Partial<Product>;
    };
    try {
      const schema = object({
        name: string().required(),
        description: string().required(),
        stripeKey: string().required(),
        urls: object({
          home: string().required(),
          privacyPolicy: string().required(),
          termsOfService: string().required(),
        }),
      });
      const validatedData = await schema.validate(data);
      req.body = {
        ...req.body,
        data: validatedData,
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default ProductMiddleware;
