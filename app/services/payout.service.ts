import { TransactionStatus } from "../../interfaces";
import { TransactionModel, AffiliateModel } from "../models";

class PayoutService {
  private transactionModel: typeof TransactionModel;
  private affiliateModel: typeof AffiliateModel;

  constructor() {
    this.transactionModel = TransactionModel;
    this.affiliateModel = AffiliateModel;
  }

  public async updateRedeemableBalance(productId: string, userId: string) {
    const affiliate = await this.affiliateModel.findOne({
      user: userId,
      product: productId,
    });

    const transactions = await this.transactionModel.find({
      product: productId,
      user: userId,
      status: TransactionStatus.Created,
      createdAt: {
        $lt: new Date(
          Date.now() - affiliate?.config.bufferDays! * 24 * 60 * 60 * 1000
        ),
      },
    });

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const redeemableBalance = transactions.reduce(
      (acc, curr) => acc + curr.commission.amountInUsd,
      0
    );

    const updatedAffiliate = await this.affiliateModel
      .findByIdAndUpdate(affiliate._id, {
        $inc: {
          "payment.redeemable": redeemableBalance,
          "payment.inBuffer": -redeemableBalance,
        },
      })
      .select("payment");

    this.transactionModel.updateMany(
      {
        _id: {
          $in: transactions.map((transaction) => transaction._id),
        },
      },
      {
        status: TransactionStatus.REDEEMABLE,
      }
    );

    return updatedAffiliate;
  }
}
