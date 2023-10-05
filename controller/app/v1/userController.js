const User = require("../../../models/user");
const Pay = require("../../../models/pay");
const Product = require("../../../models/product");

const authService = require("../../../services/auth");
const fs = require("fs");
const path = require("path");

const loginUser = async (req, res) => {
  try {
    const { googleToken, type, firebaseUid } = req.body;
    let user_type = "affiliate";

    if (type === 0) {
      user_type = "admin";
    }
    console.log(googleToken);
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
        user_type,
        name: name,
        profile_pic: picture,
        firebase_uid: firebaseUid,
      }).save();
    } else {
      if (user_type === user.user_type) {
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
      message: "Oops! some error occured from Backend",
    });
  }
};

const sales = async (req, res) => {
  try {
    const { appId } = req.body;

    const pay = await Pay.find({
      appId: appId,
    });
    console.log(pay);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Oops! some error occured from Backend",
    });
  }
};

const afflliateCode = async (req, user, res) => {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: "once",
      name: `${user.name} Affiliate 20% off`,
      applies_to: {
        products:
          process.env.ENVIRONMENT === "production"
            ? [
                "prod_NXDoDaV0sxg4uN",
                "prod_Nh0uPc3hkunm85",
                "prod_NXDofhrDAVaF3F",
              ]
            : [
                "prod_NWbaPgzVb4sU8z",
                "prod_NWbXvSoF8w33SR",
                "prod_Ndy6nae5RCgsfR",
              ],
      },
      metadata: {
        firebaseUID: user.uid,
      },
    });

    let promotionCode = null;

    for (let i = 0; i < 5; i++) {
      try {
        const newCode = generate({
          length: 6,
          count: 1,
          charset: "ABCDEFGHIJKLMNOPQRSTUVWXYS0123456789",
          prefix: user.name?.substring(0, 4)?.toUpperCase(),
        });

        promotionCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: newCode[0],
          metadata: {
            firebaseUID: user.uid,
          },
          restrictions: {
            first_time_transaction: true,
          },
        });

        break;
      } catch (error) {
        continue;
      }
    }
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

    const products = await Product.find({
      user_id: _id,
    });
    console.log(products);

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

const userProduct = async (req, res) => {
  try {
    const { _id } = req.query;

    const product = await Product.find({
      _id: _id,
    });
    console.log(product);

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: { product },
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
  sales,
  afflliateCode,
  userProducts,
  userProduct,
};
