import { Request, Response, NextFunction } from "express";
import { AffiliateModel } from "../models";
import { config } from "../../config";
import { UserDocument } from "../../interfaces";

class AffiliateMiddleware {
  private affiliateModel: typeof AffiliateModel;

  constructor() {
    this.affiliateModel = AffiliateModel;
    this.authorizeUser = this.authorizeUser.bind(this);
  }

  public async authorizeUser(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body as { user: UserDocument };
    const { affiliateId } = req.params;

    try {
      const affiliate = await this.affiliateModel.findOne({
        _id: affiliateId,
        user: user._id,
      });
      if (!affiliate) {
        throw new Error("Unauthorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default AffiliateMiddleware;
