import {
  Transaction,
  TransactionDocument,
  TransactionPayload,
  TransactionStatus,
} from "../../interfaces";
import { TransactionModel } from "../models";
import AffiliateService from "./affiliate.service";
import UserService from "./user.service";
import { Convert } from "easy-currencies";

class TransactionService {
  private transactionModel: typeof TransactionModel;
  private affiliateService: AffiliateService;
  private userService: UserService;

  constructor() {
    this.transactionModel = TransactionModel;
    this.affiliateService = new AffiliateService();
    this.userService = new UserService();

    this.create = this.create.bind(this);
    this.refund = this.refund.bind(this);
    this.listByUser = this.listByUser.bind(this);
    this.listByProduct = this.listByProduct.bind(this);
    this.listByAffiliate = this.listByAffiliate.bind(this);
  }

  public async create(transactionPayload: TransactionPayload) {
    const affiliate = await this.affiliateService.getAffiliateByCodeOrLink(
      transactionPayload.code,
      transactionPayload.linkId
    );
    const commissionPercent =
      affiliate.config.commissions[
        transactionPayload.stripeProductId as keyof typeof affiliate.config.commissions
      ];
    const commissionInCurrency =
      (transactionPayload.sale.amount * commissionPercent) / 10000;

    const saleInUsd = await Convert(transactionPayload.sale.amount / 100)
      .from(transactionPayload.sale.currency.toUpperCase())
      .to("USD");
    const commission = (saleInUsd * commissionPercent) / 100;

    const newTransaction = new this.transactionModel({
      user: affiliate.user,
      product: affiliate.product,
      stripeProductId: transactionPayload.stripeProductId,
      paymentIntentId: transactionPayload.paymentIntentId,
      sale: {
        amount: transactionPayload.sale.amount / 100,
        currency: transactionPayload.sale.currency,
      },
      codeUsed: transactionPayload.code,
      linkId: transactionPayload.linkId,
      commission: {
        amount: commissionInCurrency,
        amountInUsd: commission,
        percent: commissionPercent,
      },
    });

    await newTransaction.save();

    affiliate.earnings += commission;
    affiliate.referrals += 1;
    affiliate.sales += saleInUsd;
    affiliate.payment.inBuffer += commission;

    await affiliate.save();

    await this.userService.update(affiliate.user as string, {
      $inc: {
        totalEarnings: commission,
        totalReferrals: 1,
        totalSales: saleInUsd,
      },
    });

    return newTransaction;
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
