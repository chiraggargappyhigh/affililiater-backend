import { RedirectService } from "../services";
import { Request, Response, NextFunction } from "express";
import { Redirect } from "../../interfaces";

class RedirectController {
  private redirectService: RedirectService;
  constructor() {
    this.redirectService = new RedirectService();

    this.handleRedirect = this.handleRedirect.bind(this);
  }

  public async handleRedirect(req: Request, res: Response, next: NextFunction) {
    try {
      const redirectUrl = await this.redirectService.handleRedirect(req);
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  }
}

export default RedirectController;
