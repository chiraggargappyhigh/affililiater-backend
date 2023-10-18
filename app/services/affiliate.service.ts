import { Request, Response, NextFunction } from "express";
import { AffiliateModel } from "../models";
import {
  Affiliate,
  AffiliateDocument,
  Product,
  ProductDocument,
  UserDocument,
} from "../../interfaces";
import { config } from "../../config";
import ProductService from "./product.service";
import Stripe from "stripe";
import { AES } from "crypto-js";
import { QueryOptions } from "mongoose";

class AffiliateService {
  private affiliateModel: typeof AffiliateModel;
  private productService: ProductService;

  constructor() {
    this.affiliateModel = AffiliateModel;
    this.productService = new ProductService();
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getAffiliateByCode = this.getAffiliateByCode.bind(this);
    this.getRedirectLink = this.getRedirectLink.bind(this);
    this.createExtraLink = this.createExtraLink.bind(this);
    this.deleteExtraLink = this.deleteExtraLink.bind(this);
    this.readUserAffiliate = this.readUserAffiliate.bind(this);
    this.listUserAffiliates = this.listUserAffiliates.bind(this);
    this.createPromotionalUrl = this.createPromotionalUrl.bind(this);
    this.createStripeCode = this.createStripeCode.bind(this);
  }

  private async createStripeCode(
    key: string,
    codeConfig: Product["defaultConfig"],
    user: UserDocument,
    stripeProductIds: string[]
  ) {
    // console.log("key", key);
    // const decodedKey = AES.decrypt(key, config.cryptoSecret).toString();
    // console.log("decodedKey", decodedKey);
    const stripe = new Stripe(key, {
      apiVersion: "2023-08-16",
    });

    const coupon = await stripe.coupons.create({
      percent_off: codeConfig.couponDiscount,
      duration: "once",
      name: `${user.name}'s Affiliate ${codeConfig.couponDiscount}% off`,
      applies_to: {
        products: stripeProductIds,
      },
      metadata: {
        affiliateEmail: user.email,
      },
    });

    console.log("coupon", coupon);

    let code: Stripe.PromotionCode | null = null;

    const { generate } = await import("referral-codes");
    for (let i = 0; i < 10; i++) {
      const newCode = generate({
        length: 6,
        count: 1,
        charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
        prefix: user.name?.substring(0, 4)?.toUpperCase(),
      });
      try {
        const existingCode = await this.affiliateModel.findOne({
          "promotionDetails.code": newCode,
        });
        if (existingCode) {
          continue;
        }
        code = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: newCode[0],
          restrictions: {
            first_time_transaction: true,
          },
        });
        break;
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    if (!code) {
      throw new Error("Could not create code");
    }

    console.log("code", code);

    return {
      code: code.code,
      codeId: code.id,
    };
  }

  public async createPromotionalUrl(prefix?: string) {
    let link: string | null = null;
    const { generate } = await import("referral-codes");
    for (let i = 0; i < 10; i++) {
      const uniqueId = generate({
        length: 10,
        count: 1,
        charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
        prefix: prefix?.substring(0, 5)?.toUpperCase() || "",
      });
      link = `${uniqueId}`;
      const existingLink = await this.affiliateModel.findOne({
        $or: [
          {
            "promotionDetails.defaultLink": link,
          },
          {
            "promotionDetails.extraLinks": link,
          },
        ],
      });

      if (existingLink) {
        continue;
      }
    }

    if (!link) {
      throw new Error("Could not create link");
    }

    return link;
  }

  public async create(productId: string, user: UserDocument) {
    const product = await this.productService.getProduct(productId);
    const stripeProductIds = Object.keys(product.defaultConfig.commissions).map(
      (key) => key.toString()
    );

    const existingAffiliate = await this.affiliateModel.findOne({
      product: productId,
      user: user._id,
    });
    if (existingAffiliate) {
      return {
        affiliate: existingAffiliate,
        product,
      };
    }

    const { code, codeId } = await this.createStripeCode(
      product.stripeKey,
      product.defaultConfig,
      user,
      stripeProductIds
    );
    const newAffiliate: AffiliateDocument = new this.affiliateModel({
      product: productId,
      user: user._id,
      config: product.defaultConfig,
      promotionDetails: {
        code,
        codeId,
        defaultLink: await this.createPromotionalUrl(productId),
      },
    });
    await newAffiliate.save();

    const affiliate = await this.affiliateModel
      .findById(newAffiliate._id)
      .select("-promotionDetails.codeId -user -product");
    return {
      affiliate,
      product,
    };
  }

  public async update(id: string, data: QueryOptions<AffiliateDocument>) {
    const updatedAffiliate = await this.affiliateModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
    if (!updatedAffiliate) {
      throw new Error("Affiliate not found");
    }
    return updatedAffiliate;
  }

  public async createExtraLink(id: string, prefix?: string) {
    const affiliate = await this.affiliateModel.findById(id);
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const existingLinkCount = affiliate.promotionDetails.extraLinks.length;
    if (existingLinkCount >= 5) {
      throw new Error("Maximum number of links reached");
    }

    const link = await this.createPromotionalUrl(prefix);
    affiliate.promotionDetails.extraLinks.push(link);
    await affiliate.save();
    return affiliate;
  }

  public async deleteExtraLink(id: string, link: string) {
    const affiliate = await this.affiliateModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          "promotionDetails.extraLinks": link,
        },
      },
      {
        new: true,
      }
    );

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    return affiliate;
  }

  public async getAffiliateByCode(code: string) {
    console.log(code);
    const affiliate = await this.affiliateModel.findOne({
      "promotionDetails.codeId": code,
    });
    console.log(affiliate);
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    return affiliate;
  }

  public async getRedirectLink(
    link: string,
    code?: string | null
  ): Promise<{ redirectUrl: string; productId: string; userId: string }> {
    console.log("link", link);
    const affiliate = await this.affiliateModel
      .findOne({
        $or: [
          {
            "promotionDetails.defaultLink": link,
          },
          {
            "promotionDetails.extraLinks": link,
          },
        ],
      })
      .populate("product")
      .select("product user");

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const product = affiliate.product as ProductDocument;
    const redirectLink = product.urls.redirect;

    let returnObj: any = {
      productId: product._id,
      userId: affiliate.user,
    };
    if (!code) {
      returnObj.redirectUrl = redirectLink.replace("{{CODE}}", "");
      return returnObj;
    }

    returnObj.redirectUrl = redirectLink.replace("{{CODE}}", code);
    return returnObj;
  }

  public async readUserAffiliate(userId: string, productId: string) {
    const affiliate = await this.affiliateModel
      .findOne({ user: userId, product: productId })
      .select("-promotionDetails.codeId -user -product");
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    return affiliate;
  }

  public async listUserAffiliates(userId: string) {
    const affiliates = await this.affiliateModel
      .find({ user: userId })
      .populate("product", "name description logo _id")
      .select("-promotionDetails.codeId");
    if (!affiliates) {
      throw new Error("Affiliates not found");
    }

    return affiliates;
  }

  public async updateRedeemableBalance(productId: string) {}
}

export default AffiliateService;
