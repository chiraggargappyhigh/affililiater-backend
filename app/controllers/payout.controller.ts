import { Request, Response, NextFunction } from "express";
import { PayoutService } from "../services";
import { UserDocument } from "../../interfaces";

class PayoutController {
  private payoutService: PayoutService;
  constructor() {
    this.payoutService = new PayoutService();
    this.updateRedeemableBalance = this.updateRedeemableBalance.bind(this);
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
}

export default PayoutController;
