import { Request, Response, NextFunction } from "express";
import { paypalService, payoutService } from "../services";

class PaypalController {
  private paypalService: typeof paypalService = paypalService;
  private payoutService: typeof payoutService = payoutService;

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
      const { event_type, resource, resource_type } = req.body;
      if (resource_type === "payouts") {
        const batchId = resource.batch_header.payout_batch_id;
        const status = resource.batch_header.batch_status;
        console.log("batchId - payouts", batchId);
        console.log("status - payouts", status);
        // await this.payoutService.updatePayoutStatus(batchId, status);
      } else if (resource_type === "payouts_item") {
        const batchId = resource.payout_batch_id;
        const status = resource.transaction_status;
        // await this.payoutService.updatePayoutItemStatus(batchId, status);
        console.log("batchId - payouts item", batchId);
        console.log("status - payouts item", status);
      } else {
        throw new Error("Invalid resource type");
      }
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
