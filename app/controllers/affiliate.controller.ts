import { Request, Response, NextFunction } from "express";
import { affiliateService } from "../services";
import { Affiliate, UserDocument } from "../../interfaces";
import { config } from "../../config";

class AffiliateController {
  private affiliateService: typeof affiliateService = affiliateService;

  constructor() {
    this.create = this.create.bind(this);
    this.readUserAffiliate = this.readUserAffiliate.bind(this);
    this.listUserAffiliates = this.listUserAffiliates.bind(this);
    this.createExtraLink = this.createExtraLink.bind(this);
    this.deleteExtraLink = this.deleteExtraLink.bind(this);
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        data: { productId },
        user,
      } = req.body as {
        data: { productId: string };
        user: UserDocument;
      };
      const { affiliate, product } = await this.affiliateService.create(
        productId,
        user as UserDocument
      );
      res.status(201).json({
        status: "success",
        message: `You're now an affiliate for ${product.name}!`,
        affiliate,
      });
    } catch (error) {
      next(error);
    }
  }

  public async readUserAffiliate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user } = req.body as {
        user: UserDocument;
      };
      const { productId } = req.params;
      const affiliate = await this.affiliateService.readUserAffiliate(
        user._id,
        productId
      );
      res.status(200).json({
        status: "success",
        message: "Affiliate found",
        data: affiliate,
      });
    } catch (error) {
      next(error);
    }
  }

  public async listUserAffiliates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user } = req.body as { user: UserDocument };
      const affiliates = await this.affiliateService.listUserAffiliates(
        user._id
      );
      res.status(200).json({
        status: "success",
        message: "Affiliates found",
        data: affiliates,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createExtraLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { affiliateId } = req.params;
      const { prefix } = req.query;
      const affiliate = await this.affiliateService.createExtraLink(
        affiliateId,
        prefix as string
      );
      res.status(200).json({
        status: "success",
        message: "Affiliate found",
        data: affiliate.promotionDetails.extraLinks,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteExtraLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { affiliateId } = req.params;
      const { link } = req.query;
      if (!link) throw new Error("Link is required");
      const affiliate = await this.affiliateService.deleteExtraLink(
        affiliateId,
        link as string
      );
      res.status(200).json({
        status: "success",
        message: "Affiliate found",
        data: affiliate.promotionDetails.extraLinks,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AffiliateController;
