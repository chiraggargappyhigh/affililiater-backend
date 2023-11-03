import { Request, Response, NextFunction } from "express";
import { payoutService } from "../services";
import { UserDocument } from "../../interfaces";

class PayoutController {
  private payoutService: typeof payoutService = payoutService;
  constructor() {
    this.updateRedeemableBalance = this.updateRedeemableBalance.bind(this);
  }

  public async createPayoutRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.params;
    const { user } = req.body as { user: UserDocument };

    try {
      const payoutRequest = await this.payoutService.createPayoutRequest(
        productId,
        user._id
      );

      res.status(200).json({
        status: "success",
        message: "Payout request created successfully",
        payoutRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateRedeemableBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { user } = req.body as { user: UserDocument };
    const { productId } = req.params;

    try {
      const affiliate = await this.payoutService.updateRedeemableBalance(
        productId,
        user._id
      );

      res.status(200).json({
        status: "success",
        message: "Affiliate updated successfully",
        payment: affiliate?.payment,
      });
    } catch (error) {
      next(error);
    }
  }

  public async listPayoutRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.params;
    const { user } = req.body as { user: UserDocument };
    const { l: limit, p: page } = req.query;

    try {
      const payoutRequests = await this.payoutService.listByAffiliate(
        productId,
        user._id,
        limit as string,
        page as string
      );

      res.status(200).json({
        status: "success",
        message: "Payout requests fetched successfully",
        payoutRequests,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PayoutController;
