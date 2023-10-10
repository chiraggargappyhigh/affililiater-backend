const User = require("../../../models/user");
const Pay = require("../../../models/pay");
const Product = require("../../../models/product");
const Affiliate = require("../../../models/affiliate");
const authService = require("../../../services/auth");
const fs = require("fs");
const path = require("path");
const { initializeStripe } = require("./../../../utils/stripe");
const { Convert } = require("easy-currencies");
const loginUser = async (req, res) => {
  try {
    const { googleToken, type, firebaseUid } = req.body;
    if (!googleToken) {
      throw new Error("Invalid payload for login");
    }

    const { name, email, picture } = await authService.verifyGoogleOneTap(
      googleToken
    );

    let user = await User.findOne({ email });

    if (!user) {
      user = await new User({
        email,
        user_type: type,
        name: name,
        profile_pic: picture,
        firebase_uid: firebaseUid,
      }).save();
    } else {
      if (type === user.user_type) {
        user.name = name;
        user.profile_pic = picture;
        await user.save();
      } else {
        throw new Error();
      }
    }

    const privateKey = fs.readFileSync(
      path.join(__dirname, "..", "..", "..", "secrets", "private.pem")
    );
    const accessToken = authService.generateToken(
      {
        _id: user._id,
        email: user.email,
        type: user.user_type,
        name: name,
      },
      privateKey
    );

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error || "Oops! some error occured from Backend",
    });
  }
};

const salesByApp = async (req, res) => {
  try {
    const { appId } = req.body;
    const { _id } = req.user;

    const pays = await Pay.find({
      app: appId,
      user_id: _id,
    });

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: pays,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const salesByUser = async (req, res) => {
  try {
    const { _id } = req.user;

    const pays = await Pay.find({
      user_id: _id,
    });

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: pays,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const afflliateCode = async (req, res) => {
  try {
    const { product_id, is_live } = req.body;
    const { _id, name } = req.user;

    const product = await Product.findOne({ _id: product_id });
    const product_ids = Object.keys(
      Object.fromEntries(product.default_config.comission)
    );

    const affiliate = await Affiliate.findOne({
      user_id: _id,
      "app.id": product_id,
    });
    if (affiliate) {
      throw new Error("You are already afiliated.");
    }

    let stripe;
    if (is_live) {
      stripe = initializeStripe(product.stripe.live_key);
    } else {
      stripe = initializeStripe(product.stripe.test_key);
    }

    const coupon = await stripe.coupons.create({
      percent_off: product.default_config.coupon_discount,
      duration: "once",
      name: `${name} Affiliate 20% off`,
      applies_to: {
        products: product_ids,
      },
    });

    let promotionCode = null;

    for (let i = 0; i < 5; i++) {
      try {
        const { generate } = await import("referral-codes");
        const newCode = generate({
          length: 6,
          count: 1,
          charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
          prefix: name?.substring(0, 4)?.toUpperCase(),
        });

        promotionCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: newCode[0],

          restrictions: {
            first_time_transaction: true,
          },
        });

        break;
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    console.log("hdgch", promotionCode);
    const newAffiliate = new Affiliate({
      user_id: _id,
      promotion_code: promotionCode.code,
      promotion_link: "example.com",
      app: {
        id: product_id,
        name: product.name,
        description: product.description,
        logo: product.logo,
      },
      config: product.default_config
    });
    const savedUser = await newAffiliate.save();
    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { savedUser },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error || "Oops! some error occured from Backend",
    });
  }
};

const Products = async (req, res) => {
  try {
    const products = await Product.find({}).limit(20);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { products },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const userProducts = async (req, res) => {
  try {
    const { _id } = req.user;

    const affiliates = await Affiliate.find({
      user_id: _id,
    });
    console.log(affiliates);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { affiliates },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const userProduct = async (req, res) => {
  try {
    const { _id, is_live } = req.query;

    const affiliate = await Affiliate.find({
      _id: _id,
    });
    console.log(affiliate);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { affiliate },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const user = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.find({
      _id: _id,
    });
    console.log(user);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const transactionWebhook = async (req, res) => {
  try {
    const { product_id, promotion_code, amount, currency } = req.body;

    console.log(req.body);
    const affiliate = await Affiliate.findOne({ promotion_code });

    console.log(affiliate);
    const comissionPercent = Object.fromEntries(affiliate.config.comission)[
      product_id
    ];
    const comission = (amount * comissionPercent) / 10000;
    const amountinUSD = await Convert(amount)
      .from(currency.toUpperCase())
      .to("USD");
    const comissionInUSD = await Convert(comission)
      .from(currency.toUpperCase())
      .to("USD");
    if (!affiliate) {
      res.status(200).json({
        status: "success",
        message: "used normal coupon code",
        data: {},
      });
    }
    const pay = await new Pay({
      app: affiliate.app.id,
      user_id: affiliate.user_id,
      promotion_code,
      saleAmount: amount,
      salesCurrency: currency,
      saleDate: new Date().toISOString(),
      comission: {
        inCurrency: comission,
        inUSD: comissionInUSD,
      },
    }).save();

    await User.findOneAndUpdate(
      { _id: affiliate.user_id },
      {
        $inc: {
          total_earning: comissionInUSD,
          total_referrals: 1,
          total_sales: amountinUSD,
        },
      }
    );

    await Affiliate.findOneAndUpdate(
      { promotion_code },
      {
        $inc: {
          earnings: comissionInUSD,
          referrals: 1,
          sales: amountinUSD,
        },
      }
    );
    console.log(pay);

    res.status(200).json({
      status: "success",
      message: "Code applied.",
      data: { pay },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

module.exports = {
  loginUser,
  salesByApp,
  afflliateCode,
  userProducts,
  userProduct,
  Products,
  transactionWebhook,
  salesByUser,
  user,
};
