import { Request } from "express";
import { Redirect, RedirectDocument, RedirectPayload } from "../../interfaces";
import { RedirectModel } from "../models";
import { affiliateService } from ".";
import { config } from "../../config";

class RedirectService {
  private RedirectModel: typeof RedirectModel = RedirectModel;
  private affiliateService: typeof affiliateService = affiliateService;

  constructor() {
    this.create = this.create.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  private async create(data: RedirectPayload): Promise<RedirectDocument> {
    const { referredFrom, referredTo, user, product } = data;
    const redirect = await this.RedirectModel.create({
      user,
      product,
      referredFrom,
      referredTo,
    });

    return redirect;
  }

  public async handleRedirect(req: Request) {
    let { id } = req.params;
    const referrer = req.headers.referrer || req.headers.referer || "unknown";

    const { userId, productId, redirectUrl } =
      await this.affiliateService.getRedirectLink(id);

    await this.create({
      referredFrom: referrer as string,
      referredTo: id,
      user: userId,
      product: productId,
    });

    return redirectUrl;
  }
}

export default RedirectService;
