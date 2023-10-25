import { ProductModel } from "../models";
import {
  ProductDocument,
  ProductPermission,
  ProductRole,
  Product,
  ProductPermissionValues,
} from "../../interfaces";
import { config } from "../../config";
import Stripe from "stripe";
import * as _ from "lodash";
class ProductService {
  private ProductModel: typeof ProductModel;

  constructor() {
    this.ProductModel = ProductModel;

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.list = this.list.bind(this);
    this.hasAccess = this.hasAccess.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this.updateMembers = this.updateMembers.bind(this);
    this.populateStripeProducts = this.populateStripeProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
  }

  private async populateStripeProducts(
    commissions: Product["defaultConfig"]["commissions"],
    key: string
  ) {
    const stripe = new Stripe(key, {
      apiVersion: "2023-08-16",
    });

    const products = await stripe.products.list({
      ids: Object.keys(commissions),
    });

    const data = products.data.map(async (product) => {
      const stripePrices: Stripe.Price[] = (
        await stripe.prices.list({
          product: product.id,
          active: true,
          expand: ["data.currency_options"],
        })
      ).data;

      const prices = await stripePrices.map((price) => {
        console.log(product.id, price.id, commissions);
        if (commissions[product.id][price.id] === undefined) {
          return null;
        }
        let returnObj: any = {
          prices: {},
          name: price?.nickname,
          commission: commissions[product.id][price.id],
        };

        if (price.recurring) {
          returnObj.interval = `${price.recurring?.interval_count}_${price.recurring?.interval}`;
        } else {
          returnObj.interval = null;
        }
        if (price.currency_options) {
          for (let [key, value] of Object.entries(price.currency_options)) {
            returnObj.prices[key.toUpperCase()] = Number(
              (value?.unit_amount! / 100).toFixed(2)
            );
          }
        } else {
          returnObj.prices[price.currency.toUpperCase()] = Number(
            (price.unit_amount! / 100).toFixed(2)
          );
        }

        return returnObj;
      });

      console.log(prices);

      const sanitizedPrices = prices.filter((price) => price !== null);
      return {
        name: product.name,
        description: product.description,
        image: product.images[0],
        prices: sanitizedPrices.map((price) => ({
          prices: price.prices,
          interval: price.interval,
          name: price.name,
          commission: price.commission,
        })),
      };
    });

    return await Promise.all(data);
  }

  public async create(
    data: Partial<Product>,
    userId: string,
    userEmail: string
  ) {
    const newProduct: ProductDocument = new this.ProductModel({
      ...data,
      members: [
        {
          user: userId,
          role: ProductRole.ADMIN,
          permissions: ProductPermissionValues,
        },
      ],
      contactEmail: userEmail,
      stripeKey: data.stripeKey!,
    });

    return await newProduct.save();
  }

  public async update(id: string, data: Partial<ProductDocument>) {
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return updatedProduct;
  }

  public async addMembers(id: string, data: ProductDocument["members"]) {
    const product = await this.ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.members.push(...data);
    return await product.save();
  }

  public async updateMembers(
    id: string,
    data: {
      userId: string;
      role: ProductRole;
      permissions: ProductPermission[];
    }
  ) {
    const product = await this.ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const memberIndex = product.members.findIndex(
      (member) => member.user === data.userId
    );
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }
    product.members[memberIndex].role = data.role;
    product.members[memberIndex].permissions = data.permissions;

    return product.save();
  }

  public async read(id: string) {
    const product = await this.ProductModel.findById(id)
      .populate("promotionalAssets")
      .lean();
    if (!product) throw new Error("Product not found");
    const stripeProducts = await this.populateStripeProducts(
      product.defaultConfig.commissions,
      product.stripeKey
    );

    const returnProduct: any = product;
    delete returnProduct.stripeKey;
    delete returnProduct.defaultConfig;
    delete returnProduct.members;
    return {
      ...returnProduct,
      stripeProducts,
    };
  }

  public async list() {
    const products = await this.ProductModel.find()
      .lean()
      .select("-members -stripeKey -urls.redirect -defaultConfig");
    const data = products.map(async (product) => {
      const stripeProducts = await this.populateStripeProducts(
        product.defaultConfig.commissions,
        product.stripeKey
      );
      product.stripeProducts = stripeProducts;

      return product;
    });
    return await Promise.all(data);
  }

  public async hasAccess(
    userId: string,
    productId: string,
    permissions: Array<ProductPermission>
  ) {
    const product = await this.ProductModel.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const member = product.members.find((member) => member.user === userId);
    if (!member) {
      throw new Error("Member not found");
    }
    const hasAccess = member.permissions.some((permission) =>
      permissions.includes(permission)
    );

    return hasAccess;
  }

  public async getProduct(productId: string) {
    const product = (await this.ProductModel.findById(
      productId
    ).lean()) as Product;
    return product;
  }
}

export default ProductService;
