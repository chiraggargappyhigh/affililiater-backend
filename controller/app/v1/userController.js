const User = require("../../../models/user");
const Pay = require("../../../models/pay");

const authService = require("../../../services/auth");

const loginUser = async (req, res) => {
  try {
    const {
      googleToken,
      loginType,
      platform,
      packageId,
      firstName,
      lastName,
      mobileNo,
      company,
    } = req.body;

    const userDetails = {};

    if (firstName || lastName) {
      userDetails.name =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || "";
    }
    if (mobileNo) {
      userDetails.mobileNo = mobileNo;
    }
    if (company) {
      userDetails.companyDetails = {
        name: company,
      };
    }
    if (website) {
      userDetails.website = website;
    }
    if (hearAboutUs) {
      userDetails.hearAboutUs = hearAboutUs;
    }

    if (!googleToken || !packageId) {
      throw new Error("Invalid payload for login");
    }

    const { name, email, picture } = await authService.verifyGoogleOneTap(
      googleToken
    );

    let user = await User.findOne({ email, packageId });

    if (!user) {
      user = await new User({
        name,
        email,
        loginType,
        platform,
        packageId,
        avatar: picture,
        userType: TYPE_USER.FREE,
      }).save();
    } else if (!user && packageId === "PACKAGE_ID_PHOT_AI_3rd_PARTY") {
      user = await new User({
        email,
        loginType,
        platform,
        packageId,
        avatar: picture,
        ...userDetails,
        userType: TYPE_USER.FREE,
      }).save();
    } else if (user && packageId === "PACKAGE_ID_PHOT_AI_3rd_PARTY") {
      user = await User.findByIdAndUpdate(user._id, {
        email,
        loginType,
        platform,
        packageId,
        avatar: picture,
        ...userDetails,
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        platform,
        loginType,
        name,
        avatar: picture,
      });
    }

    const accessToken = generateToken(
      {
        _id: user._id,
        email: user.email,
        platform: user.platform,
        userType: user.userType,
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
    return res.internalServerError({
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
    return res.internalServerError({
      message: "Oops! some error occured from Backend",
    });
  }
};

module.exports = {
  loginUser,
  sales,
};
