import { PayoutStatus, TransactionStatus } from "../../interfaces";
import { TransactionModel, AffiliateModel, PayoutModel } from "../models";
import { paypalService } from ".";

class PayoutService {
  private transactionModel: typeof TransactionModel = TransactionModel;
  private affiliateModel: typeof AffiliateModel = AffiliateModel;
  private payoutModel: typeof PayoutModel = PayoutModel;

  private paypalService: typeof paypalService = paypalService;

  constructor() {
    this.updateRedeemableBalance = this.updateRedeemableBalance.bind(this);
    this.createPayoutRequest = this.createPayoutRequest.bind(this);
    this.listByAffiliate = this.listByAffiliate.bind(this);
  }

  public async createPayoutRequest(productId: string, userId: string) {
    const affiliate = await this.affiliateModel.findOne({
      user: userId,
      product: productId,
    });

    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const amount = affiliate.payment.redeemable;
    if (amount <= 100) {
      throw new Error("Minimum payout amount is $100");
    }
    const payoutRequest = await new this.payoutModel({
      affiliate: affiliate._id,
      amount,
    }).save();

    return payoutRequest;
  }

  public async updateRedeemableBalance(productId: string, userId: string) {
    const affiliate = await this.affiliateModel.findOne({
      user: userId,
      product: productId,
    });

    const transactions = await this.transactionModel.find({
      product: productId,
      user: userId,
      status: TransactionStatus.CREATED,
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

  public async listByAffiliate(
    productId: string,
    userId: string,
    l: string = "10",
    p: string = "1"
  ) {
    const limit = parseInt(l);
    const page = parseInt(p);
    const payouts = await this.payoutModel
      .find({
        user: userId,
        product: productId,
      })
      .skip(limit * page - limit)
      .limit(limit);

    return payouts;
  }
}

export default PayoutService;
