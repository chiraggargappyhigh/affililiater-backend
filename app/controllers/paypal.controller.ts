import { Request, Response, NextFunction } from "express";
import { PaypalService } from "../services";

class PaypalController {
  private paypalService: PaypalService;

  constructor() {
    this.paypalService = new PaypalService();
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
      await this.paypalService.connectPaypal(affiliateId, code);
      res.status(200).json({
        status: "success",
        message: "Paypal connected successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PaypalController;
