import { PayoutStatus, TransactionStatus } from "../../interfaces";
import { TransactionModel, AffiliateModel, PayoutModel } from "../models";
import { paypalService } from ".";
import { config } from "../../config";

class PayoutService {
  private transactionModel: typeof TransactionModel = TransactionModel;
  private affiliateModel: typeof AffiliateModel = AffiliateModel;
  private payoutModel: typeof PayoutModel = PayoutModel;

  private paypalService: typeof paypalService = paypalService;

  constructor() {
    this.updateRedeemableBalance = this.updateRedeemableBalance.bind(this);
    this.createPayoutRequest = this.createPayoutRequest.bind(this);
    this.listByAffiliate = this.listByAffiliate.bind(this);
    this.updatePayoutStatus = this.updatePayoutStatus.bind(this);
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
    if (amount <= (config.node_env !== "production" ? 1 : 100)) {
      throw new Error(
        "Minimum payout amount is " +
          (config.node_env !== "production" ? 1 : 100) +
          " USD"
      );
    }
    const paypalTransaction = await this.paypalService.initiatePayout(
      amount,
      affiliate.payout.paypalEmail,
      userId,
      productId
    );
    const payoutRequest = await new this.payoutModel({
      affiliate: affiliate._id,
      amount,
      payPalBatchId: paypalTransaction.batchId,
      payPalSenderBatchId: paypalTransaction.senderBatchId,
      status: paypalTransaction.batchStatus as PayoutStatus,
    }).save();

    affiliate.payment.redeemable -= amount;

    await affiliate.save();

    await this.transactionModel.updateMany(
      {
        product: productId,
        user: userId,
        status: TransactionStatus.REDEEMABLE,
      },
      {
        status: TransactionStatus.PROCESSING,
      }
    );

    return payoutRequest;
  }

  public async updateRedeemableBalance(productId: string, userId: string) {
    const affiliate = await this.affiliateModel.findOne({
      user: userId,
      product: productId,
    });
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const transactions = await this.transactionModel.find({
      product: productId,
      user: userId,
      status: TransactionStatus.COMMISSION_ALLOCATED,
      createdAt: {
        $lt: new Date(
          Date.now() - affiliate?.config.bufferDays! * 24 * 60 * 60 * 1000
        ),
      },
    });

    if (!transactions.length) {
      return affiliate;
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

    const updateTransactions = await this.transactionModel.updateMany(
      {
        _id: {
          $in: transactions.map((transaction) => transaction._id.toString()),
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

  public async updatePayoutStatus(payPalBatchId: string, status: PayoutStatus) {
    const payout = await this.payoutModel.findOneAndUpdate(
      {
        payPalBatchId,
      },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );

    if (!payout) {
      throw new Error("Payout not found");
    }

    if (status === PayoutStatus.SUCCESS) {
      const affiliate = await this.affiliateModel.findByIdAndUpdate(
        payout.affiliate,
        {
          $inc: {
            "payment.redeemed": payout.amount,
          },
          $set: {
            "payment.lastRedeemed": payout.amount,
          },
        },
        {
          new: true,
        }
      );

      await this.transactionModel.updateMany(
        {
          product: affiliate?.product,
          user: affiliate?.user,
          status: TransactionStatus.PROCESSING,
        },
        {
          status: TransactionStatus.REDEEMED,
        }
      );
    } else if (
      [
        PayoutStatus.DENIED,
        PayoutStatus.RETURNED,
        PayoutStatus.FAILED,
        PayoutStatus.REFUNDED,
        PayoutStatus.REVERSED,
      ].includes(status)
    ) {
      const affiliate = await this.affiliateModel.findByIdAndUpdate(
        payout.affiliate,
        {
          $inc: {
            "payment.redeemable": payout.amount,
          },
        },
        {
          new: true,
        }
      );

      await this.transactionModel.updateMany(
        {
          product: affiliate?.product,
          user: affiliate?.user,
          status: TransactionStatus.PROCESSING,
        },
        {
          status: TransactionStatus.REDEEMABLE,
        }
      );
    }

    return payout;
  }
}

export default PayoutService;
