import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services";
import {
  CreateTransactionPayload,
  Transaction,
  TransactionDocument,
  TransactionPayload,
  UserDocument,
} from "../../interfaces";

class TransactionController {
  private transactionService: TransactionService;
  constructor() {
    this.transactionService = new TransactionService();

    this.create = this.create.bind(this);
    this.addAffiliateCommission = this.addAffiliateCommission.bind(this);
    this.refund = this.refund.bind(this);
    this.listByUser = this.listByUser.bind(this);
    this.listByProduct = this.listByProduct.bind(this);
    this.listByAffiliate = this.listByAffiliate.bind(this);
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const { data } = req.body as { data: CreateTransactionPayload };
    try {
      const transaction = await this.transactionService.create(data);
      res.status(201).json({
        status: "success",
        message: "Transaction created successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addAffiliateCommission(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { data } = req.body as { data: TransactionPayload };
    try {
      const transaction = await this.transactionService.addAffiliateCommission(
        data
      );
      res.status(201).json({
        status: "success",
        message: "Affiliate commission added successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async refund(req: Request, res: Response, next: NextFunction) {
    const { data } = req.body as { data: { paymentIntentId: string } };
    try {
      const transaction = await this.transactionService.refund(
        data.paymentIntentId
      );
      res.status(200).json({
        status: "success",
        message: "Transaction refunded successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public listByUser(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body as { user: UserDocument };
    try {
      const transactions = this.transactionService.listByUser(user._id);
      res.status(200).json({
        status: "success",
        message: "Transactions retrieved successfully",
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async listByProduct(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;
    try {
      const transactions = await this.transactionService.listByProduct(
        productId
      );
      res.status(200).json({
        status: "success",
        message: "Transactions retrieved successfully",
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async listByAffiliate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.params;
    const { user } = req.body as { user: UserDocument };
    const { l, p } = req.query;
    try {
      const transactions = await this.transactionService.listByAffiliate(
        user._id,
        productId,
        l as string,
        p as string
      );
      res.status(200).json({
        status: "success",
        message: "Transactions retrieved successfully",
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TransactionController;
