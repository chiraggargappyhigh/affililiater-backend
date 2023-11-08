import { Request, Response, NextFunction } from "express";
import { paypalService } from "../services";

class PaypalController {
  private paypalService: typeof paypalService = paypalService;

  constructor() {
    this.connectPaypal = this.connectPaypal.bind(this);
    this.payoutWebhook = this.payoutWebhook.bind(this);
  }

  public async connectPaypal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      data: { affiliateId, code },
    } = req.body as {
      data: {
        affiliateId: string;
        code: string;
      };
    };

    try {
      const payout = await this.paypalService.connectPaypal(affiliateId, code);
      res.status(200).json({
        status: "success",
        message: "Paypal connected successfully",
        payout,
      });
    } catch (error) {
      next(error);
    }
  }

  public async payoutWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);
      res.status(200).send({
        status: "success",
        message: "Webhook received",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PaypalController;
