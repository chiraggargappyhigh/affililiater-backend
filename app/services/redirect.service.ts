import { Request } from "express";
import { Redirect, RedirectDocument, RedirectPayload } from "../../interfaces";
import { RedirectModel } from "../models";
import AffiliateService from "./affiliate.service";
import { config } from "../../config";

class RedirectService {
  private RedirectModel: typeof RedirectModel;
  private affiliateService: AffiliateService;

  constructor() {
    this.RedirectModel = RedirectModel;
    this.affiliateService = new AffiliateService();

    this.create = this.create.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  private async create(data: RedirectPayload): Promise<RedirectDocument> {
    const { code, referredFrom, referredTo, user, product } = data;
    const redirect = await this.RedirectModel.create({
      user,
      product,
      referredFrom,
      referredTo,
      codeApplied: code,
    });

    return redirect;
  }

  public async handleRedirect(req: Request) {
    let { id } = req.params;
    const referrer = req.headers.referrer || req.headers.referer || "unknown";
    const { code } = req.query;

    const { userId, productId, redirectUrl } =
      await this.affiliateService.getRedirectLink(id, code as string);

    await this.create({
      code: code as string,
      referredFrom: referrer as string,
      referredTo: id,
      user: userId,
      product: productId,
    });

    if (code) {
      return redirectUrl.replace("{{code}}", code as string);
    }
    return redirectUrl.replace("{{code}}", "");
  }
}

export default RedirectService;
