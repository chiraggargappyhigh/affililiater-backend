import {
  CreateTransactionPayload,
  Transaction,
  TransactionDocument,
  TransactionPayload,
  TransactionStatus,
} from "../../interfaces";
import { TransactionModel } from "../models";
import { affiliateService, userService } from ".";
import { Convert } from "easy-currencies";

class TransactionService {
  private transactionModel: typeof TransactionModel = TransactionModel;
  private affiliateService: typeof affiliateService = affiliateService;
  private userService: typeof userService = userService;

  constructor() {
    this.create = this.create.bind(this);
    this.addAffiliateCommission = this.addAffiliateCommission.bind(this);
    this.refund = this.refund.bind(this);
    this.listByUser = this.listByUser.bind(this);
    this.listByProduct = this.listByProduct.bind(this);
    this.listByAffiliate = this.listByAffiliate.bind(this);
  }

  public async create(transactionPayload: CreateTransactionPayload) {
    const newTransaction = new this.transactionModel({
      subscriptionId: transactionPayload.subscriptionId,
      linkId: transactionPayload.refId,
    });

    await newTransaction.save();

    return newTransaction;
  }

  public async addAffiliateCommission(transactionPayload: TransactionPayload) {
    const transaction = await this.transactionModel.findOne({
      subscriptionId: transactionPayload.subscriptionId,
    });
    const affiliate = await this.affiliateService.getAffiliateByCodeOrLink(
      transactionPayload.code,
      transaction?.linkId
    );
    const commissionPercent =
      affiliate.config.commissions[
        transactionPayload.stripeProductId as keyof typeof affiliate.config.commissions
      ][
        transactionPayload.stripePriceId as keyof (typeof affiliate.config.commissions)[typeof transactionPayload.stripeProductId]
      ];
    const commissionInCurrency =
      (transactionPayload.sale.amount * commissionPercent) / 10000;

    const saleInUsd = await Convert(transactionPayload.sale.amount / 100)
      .from(transactionPayload.sale.currency.toUpperCase())
      .to("USD");
    const commission = (saleInUsd * commissionPercent) / 100;

    // update transaction
    const updatedTransaction = await this.transactionModel.findOneAndUpdate(
      {
        subscriptionId: transactionPayload.subscriptionId,
      },
      {
        $set: {
          user: affiliate.user,
          product: affiliate.product,
          stripeProductId: transactionPayload.stripeProductId,
          stripePriceId: transactionPayload.stripePriceId,
          paymentIntentId: transactionPayload.paymentIntentId,
          codeUsed: transactionPayload.code,
          sale: {
            amount: transactionPayload.sale.amount,
            currency: transactionPayload.sale.currency,
          },
          commission: {
            amount: commissionInCurrency,
            amountInUsd: commission,
            percent: commissionPercent,
          },
          status: TransactionStatus.COMMISSION_ALLOCATED,
        },
      },
      {
        new: true,
      }
    );

    // update affiliate
    affiliate.earnings += commission;
    affiliate.sales += saleInUsd;
    affiliate.referrals += 1;
    affiliate.payment.inBuffer += commission;

    await affiliate.save();

    // update user
    await this.userService.update(affiliate.user as string, {
      $inc: {
        totalEarnings: commission,
        totalSales: saleInUsd,
        totalReferrals: 1,
      },
    });

    return updatedTransaction;
  }

  public async refund(paymentIntentId: string) {
    const transaction = await this.transactionModel.findOne({
      paymentIntentId,
    });
    if (!transaction) throw new Error("Transaction not found");

    const affiliate = await this.affiliateService.getAffiliateByCodeOrLink(
      transaction.codeUsed,
      transaction?.linkId
    );

    const saleInUsd = await Convert(transaction.sale.amount)
      .from(transaction.sale.currency.toUpperCase())
      .to("USD");

    affiliate.earnings -= transaction.commission.amountInUsd;
    affiliate.sales -= saleInUsd;
    affiliate.refunds += saleInUsd;
    affiliate.payment.inBuffer -= transaction.commission.amountInUsd;

    await affiliate.save();

    await this.userService.update(affiliate.user as string, {
      $inc: {
        totalEarnings: -transaction.commission.amountInUsd,
        totalSales: -saleInUsd,
        totalRefunds: saleInUsd,
      },
    });

    transaction.status = TransactionStatus.REFUNDED;
    await transaction.save();

    return transaction;
  }

  public async listByUser(userId: string) {
    const transactions = await this.transactionModel
      .find({ user: userId })
      .populate("product");

    return transactions;
  }

  public async listByProduct(productId: string) {
    const transactions = await this.transactionModel
      .find({ product: productId })
      .populate("user");

    return transactions;
  }

  public async listByAffiliate(
    userId: string,
    productId: string,
    limit?: string,
    page?: string
  ) {
    let l, p;
    if (limit) {
      l = parseInt(limit);
    } else {
      l = 10;
    }

    if (page) {
      p = parseInt(page);
    } else {
      p = 1;
    }
    const transactions = await this.transactionModel
      .find({
        user: userId,
        product: productId,
      })
      .skip(l * p - l)
      .limit(l)
      .select("codeUsed sale commission createdAt status -_id");

    return transactions;
  }
}

export default TransactionService;
