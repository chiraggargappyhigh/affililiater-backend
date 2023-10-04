/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let User_activity = require("../model/user_activity");
let Purchase = require("../model/purchase");
let Product = require("../model/product");
let Payment = require("../model/payment");
let Credit = require("../model/credit");
let Activity = require("../model/activity");
let User = require("../model/user");
let PushNotification = require("../model/pushNotification");
let UserTokens = require("../model/userTokens");
let Role = require("../model/role");
let ProjectRoute = require("../model/projectRoute");
let RouteRole = require("../model/routeRole");
let UserRole = require("../model/userRole");
let dbService = require(".//dbService");

const deleteUser_activity = async (filter) => {
  try {
    let response = await dbService.deleteMany(User_activity, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePurchase = async (filter) => {
  try {
    let purchase = await dbService.findMany(Purchase, filter);
    if (purchase && purchase.length) {
      purchase = purchase.map((obj) => obj.id);

      const creditFilter = { $or: [{ purchase: { $in: purchase } }] };
      const creditCnt = await dbService.deleteMany(Credit, creditFilter);

      let deleted = await dbService.deleteMany(Purchase, filter);
      let response = { credit: creditCnt };
      return response;
    } else {
      return { purchase: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (filter) => {
  try {
    let product = await dbService.findMany(Product, filter);
    if (product && product.length) {
      product = product.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ product_id: { $in: product } }] };
      const purchaseCnt = await dbService.deleteMany(Purchase, purchaseFilter);

      const paymentFilter = { $or: [{ product: { $in: product } }] };
      const paymentCnt = await dbService.deleteMany(Payment, paymentFilter);

      let deleted = await dbService.deleteMany(Product, filter);
      let response = {
        purchase: purchaseCnt,
        payment: paymentCnt,
      };
      return response;
    } else {
      return { product: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePayment = async (filter) => {
  try {
    let payment = await dbService.findMany(Payment, filter);
    if (payment && payment.length) {
      payment = payment.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ payment_id: { $in: payment } }] };
      const purchaseCnt = await dbService.deleteMany(Purchase, purchaseFilter);

      let deleted = await dbService.deleteMany(Payment, filter);
      let response = { purchase: purchaseCnt };
      return response;
    } else {
      return { payment: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCredit = async (filter) => {
  try {
    let response = await dbService.deleteMany(Credit, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteActivity = async (filter) => {
  try {
    let activity = await dbService.findMany(Activity, filter);
    if (activity && activity.length) {
      activity = activity.map((obj) => obj.id);

      const user_activityFilter = { $or: [{ activity_id: { $in: activity } }] };
      const user_activityCnt = await dbService.deleteMany(
        User_activity,
        user_activityFilter
      );

      let deleted = await dbService.deleteMany(Activity, filter);
      let response = { user_activity: user_activityCnt };
      return response;
    } else {
      return { activity: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) => {
  try {
    let user = await dbService.findMany(User, filter);
    if (user && user.length) {
      user = user.map((obj) => obj.id);

      const user_activityFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const user_activityCnt = await dbService.deleteMany(
        User_activity,
        user_activityFilter
      );

      const purchaseFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user_id: { $in: user } },
        ],
      };
      const purchaseCnt = await dbService.deleteMany(Purchase, purchaseFilter);

      const productFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const productCnt = await dbService.deleteMany(Product, productFilter);

      const paymentFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const paymentCnt = await dbService.deleteMany(Payment, paymentFilter);

      const creditFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const creditCnt = await dbService.deleteMany(Credit, creditFilter);

      const activityFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const activityCnt = await dbService.deleteMany(Activity, activityFilter);

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.deleteMany(User, userFilter);

      const userTokensFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userTokensCnt = await dbService.deleteMany(
        UserTokens,
        userTokensFilter
      );

      const roleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const roleCnt = await dbService.deleteMany(Role, roleFilter);

      const projectRouteFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const projectRouteCnt = await dbService.deleteMany(
        ProjectRoute,
        projectRouteFilter
      );

      const routeRoleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const routeRoleCnt = await dbService.deleteMany(
        RouteRole,
        routeRoleFilter
      );

      const userRoleFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userRoleCnt = await dbService.deleteMany(UserRole, userRoleFilter);

      let deleted = await dbService.deleteMany(User, filter);
      let response = {
        user_activity: user_activityCnt,
        purchase: purchaseCnt,
        product: productCnt,
        payment: paymentCnt,
        credit: creditCnt,
        activity: activityCnt,
        user: userCnt + deleted,
        userTokens: userTokensCnt,
        role: roleCnt,
        projectRoute: projectRouteCnt,
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePushNotification = async (filter) => {
  try {
    let response = await dbService.deleteMany(PushNotification, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) => {
  try {
    let response = await dbService.deleteMany(UserTokens, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) => {
  try {
    let role = await dbService.findMany(Role, filter);
    if (role && role.length) {
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const routeRoleCnt = await dbService.deleteMany(
        RouteRole,
        routeRoleFilter
      );

      const userRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole, userRoleFilter);

      let deleted = await dbService.deleteMany(Role, filter);
      let response = {
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { role: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) => {
  try {
    let projectroute = await dbService.findMany(ProjectRoute, filter);
    if (projectroute && projectroute.length) {
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId: { $in: projectroute } }] };
      const routeRoleCnt = await dbService.deleteMany(
        RouteRole,
        routeRoleFilter
      );

      let deleted = await dbService.deleteMany(ProjectRoute, filter);
      let response = { routeRole: routeRoleCnt };
      return response;
    } else {
      return { projectroute: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) => {
  try {
    let response = await dbService.deleteMany(RouteRole, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) => {
  try {
    let response = await dbService.deleteMany(UserRole, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUser_activity = async (filter) => {
  try {
    const user_activityCnt = await dbService.count(User_activity, filter);
    return { user_activity: user_activityCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countPurchase = async (filter) => {
  try {
    let purchase = await dbService.findMany(Purchase, filter);
    if (purchase && purchase.length) {
      purchase = purchase.map((obj) => obj.id);

      const creditFilter = { $or: [{ purchase: { $in: purchase } }] };
      const creditCnt = await dbService.count(Credit, creditFilter);

      let response = { credit: creditCnt };
      return response;
    } else {
      return { purchase: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countProduct = async (filter) => {
  try {
    let product = await dbService.findMany(Product, filter);
    if (product && product.length) {
      product = product.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ product_id: { $in: product } }] };
      const purchaseCnt = await dbService.count(Purchase, purchaseFilter);

      const paymentFilter = { $or: [{ product: { $in: product } }] };
      const paymentCnt = await dbService.count(Payment, paymentFilter);

      let response = {
        purchase: purchaseCnt,
        payment: paymentCnt,
      };
      return response;
    } else {
      return { product: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countPayment = async (filter) => {
  try {
    let payment = await dbService.findMany(Payment, filter);
    if (payment && payment.length) {
      payment = payment.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ payment_id: { $in: payment } }] };
      const purchaseCnt = await dbService.count(Purchase, purchaseFilter);

      let response = { purchase: purchaseCnt };
      return response;
    } else {
      return { payment: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countCredit = async (filter) => {
  try {
    const creditCnt = await dbService.count(Credit, filter);
    return { credit: creditCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countActivity = async (filter) => {
  try {
    let activity = await dbService.findMany(Activity, filter);
    if (activity && activity.length) {
      activity = activity.map((obj) => obj.id);

      const user_activityFilter = { $or: [{ activity_id: { $in: activity } }] };
      const user_activityCnt = await dbService.count(
        User_activity,
        user_activityFilter
      );

      let response = { user_activity: user_activityCnt };
      return response;
    } else {
      return { activity: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUser = async (filter) => {
  try {
    let user = await dbService.findMany(User, filter);
    if (user && user.length) {
      user = user.map((obj) => obj.id);

      const user_activityFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const user_activityCnt = await dbService.count(
        User_activity,
        user_activityFilter
      );

      const purchaseFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user_id: { $in: user } },
        ],
      };
      const purchaseCnt = await dbService.count(Purchase, purchaseFilter);

      const productFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const productCnt = await dbService.count(Product, productFilter);

      const paymentFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const paymentCnt = await dbService.count(Payment, paymentFilter);

      const creditFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const creditCnt = await dbService.count(Credit, creditFilter);

      const activityFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const activityCnt = await dbService.count(Activity, activityFilter);

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.count(User, userFilter);

      const userTokensFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userTokensCnt = await dbService.count(UserTokens, userTokensFilter);

      const roleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const roleCnt = await dbService.count(Role, roleFilter);

      const projectRouteFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const projectRouteCnt = await dbService.count(
        ProjectRoute,
        projectRouteFilter
      );

      const routeRoleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const routeRoleCnt = await dbService.count(RouteRole, routeRoleFilter);

      const userRoleFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userRoleCnt = await dbService.count(UserRole, userRoleFilter);

      let response = {
        user_activity: user_activityCnt,
        purchase: purchaseCnt,
        product: productCnt,
        payment: paymentCnt,
        credit: creditCnt,
        activity: activityCnt,
        user: userCnt,
        userTokens: userTokensCnt,
        role: roleCnt,
        projectRoute: projectRouteCnt,
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countPushNotification = async (filter) => {
  try {
    const pushNotificationCnt = await dbService.count(PushNotification, filter);
    return { pushNotification: pushNotificationCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) => {
  try {
    const userTokensCnt = await dbService.count(UserTokens, filter);
    return { userTokens: userTokensCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countRole = async (filter) => {
  try {
    let role = await dbService.findMany(Role, filter);
    if (role && role.length) {
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const routeRoleCnt = await dbService.count(RouteRole, routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const userRoleCnt = await dbService.count(UserRole, userRoleFilter);

      let response = {
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { role: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) => {
  try {
    let projectroute = await dbService.findMany(ProjectRoute, filter);
    if (projectroute && projectroute.length) {
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId: { $in: projectroute } }] };
      const routeRoleCnt = await dbService.count(RouteRole, routeRoleFilter);

      let response = { routeRole: routeRoleCnt };
      return response;
    } else {
      return { projectroute: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) => {
  try {
    const routeRoleCnt = await dbService.count(RouteRole, filter);
    return { routeRole: routeRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) => {
  try {
    const userRoleCnt = await dbService.count(UserRole, filter);
    return { userRole: userRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUser_activity = async (filter, updateBody) => {
  try {
    const user_activityCnt = await dbService.updateMany(User_activity, filter);
    return { user_activity: user_activityCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeletePurchase = async (filter, updateBody) => {
  try {
    let purchase = await dbService.findMany(Purchase, filter, { id: 1 });
    if (purchase.length) {
      purchase = purchase.map((obj) => obj.id);

      const creditFilter = { $or: [{ purchase: { $in: purchase } }] };
      const creditCnt = await dbService.updateMany(
        Credit,
        creditFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Purchase, filter, updateBody);

      let response = { credit: creditCnt };
      return response;
    } else {
      return { purchase: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteProduct = async (filter, updateBody) => {
  try {
    let product = await dbService.findMany(Product, filter, { id: 1 });
    if (product.length) {
      product = product.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ product_id: { $in: product } }] };
      const purchaseCnt = await dbService.updateMany(
        Purchase,
        purchaseFilter,
        updateBody
      );

      const paymentFilter = { $or: [{ product: { $in: product } }] };
      const paymentCnt = await dbService.updateMany(
        Payment,
        paymentFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Product, filter, updateBody);

      let response = {
        purchase: purchaseCnt,
        payment: paymentCnt,
      };
      return response;
    } else {
      return { product: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeletePayment = async (filter, updateBody) => {
  try {
    let payment = await dbService.findMany(Payment, filter, { id: 1 });
    if (payment.length) {
      payment = payment.map((obj) => obj.id);

      const purchaseFilter = { $or: [{ payment_id: { $in: payment } }] };
      const purchaseCnt = await dbService.updateMany(
        Purchase,
        purchaseFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Payment, filter, updateBody);

      let response = { purchase: purchaseCnt };
      return response;
    } else {
      return { payment: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteCredit = async (filter, updateBody) => {
  try {
    const creditCnt = await dbService.updateMany(Credit, filter);
    return { credit: creditCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteActivity = async (filter, updateBody) => {
  try {
    let activity = await dbService.findMany(Activity, filter, { id: 1 });
    if (activity.length) {
      activity = activity.map((obj) => obj.id);

      const user_activityFilter = { $or: [{ activity_id: { $in: activity } }] };
      const user_activityCnt = await dbService.updateMany(
        User_activity,
        user_activityFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Activity, filter, updateBody);

      let response = { user_activity: user_activityCnt };
      return response;
    } else {
      return { activity: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter, updateBody) => {
  try {
    let user = await dbService.findMany(User, filter, { id: 1 });
    if (user.length) {
      user = user.map((obj) => obj.id);

      const user_activityFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const user_activityCnt = await dbService.updateMany(
        User_activity,
        user_activityFilter,
        updateBody
      );

      const purchaseFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user_id: { $in: user } },
        ],
      };
      const purchaseCnt = await dbService.updateMany(
        Purchase,
        purchaseFilter,
        updateBody
      );

      const productFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const productCnt = await dbService.updateMany(
        Product,
        productFilter,
        updateBody
      );

      const paymentFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const paymentCnt = await dbService.updateMany(
        Payment,
        paymentFilter,
        updateBody
      );

      const creditFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { user: { $in: user } },
        ],
      };
      const creditCnt = await dbService.updateMany(
        Credit,
        creditFilter,
        updateBody
      );

      const activityFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const activityCnt = await dbService.updateMany(
        Activity,
        activityFilter,
        updateBody
      );

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.updateMany(User, userFilter, updateBody);

      const userTokensFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userTokensCnt = await dbService.updateMany(
        UserTokens,
        userTokensFilter,
        updateBody
      );

      const roleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const roleCnt = await dbService.updateMany(Role, roleFilter, updateBody);

      const projectRouteFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const projectRouteCnt = await dbService.updateMany(
        ProjectRoute,
        projectRouteFilter,
        updateBody
      );

      const routeRoleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const routeRoleCnt = await dbService.updateMany(
        RouteRole,
        routeRoleFilter,
        updateBody
      );

      const userRoleFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userRoleCnt = await dbService.updateMany(
        UserRole,
        userRoleFilter,
        updateBody
      );
      let updated = await dbService.updateMany(User, filter, updateBody);

      let response = {
        user_activity: user_activityCnt,
        purchase: purchaseCnt,
        product: productCnt,
        payment: paymentCnt,
        credit: creditCnt,
        activity: activityCnt,
        user: userCnt + updated,
        userTokens: userTokensCnt,
        role: roleCnt,
        projectRoute: projectRouteCnt,
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeletePushNotification = async (filter, updateBody) => {
  try {
    const pushNotificationCnt = await dbService.updateMany(
      PushNotification,
      filter
    );
    return { pushNotification: pushNotificationCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter, updateBody) => {
  try {
    const userTokensCnt = await dbService.updateMany(UserTokens, filter);
    return { userTokens: userTokensCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter, updateBody) => {
  try {
    let role = await dbService.findMany(Role, filter, { id: 1 });
    if (role.length) {
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const routeRoleCnt = await dbService.updateMany(
        RouteRole,
        routeRoleFilter,
        updateBody
      );

      const userRoleFilter = { $or: [{ roleId: { $in: role } }] };
      const userRoleCnt = await dbService.updateMany(
        UserRole,
        userRoleFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Role, filter, updateBody);

      let response = {
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { role: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter, updateBody) => {
  try {
    let projectroute = await dbService.findMany(ProjectRoute, filter, {
      id: 1,
    });
    if (projectroute.length) {
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId: { $in: projectroute } }] };
      const routeRoleCnt = await dbService.updateMany(
        RouteRole,
        routeRoleFilter,
        updateBody
      );
      let updated = await dbService.updateMany(
        ProjectRoute,
        filter,
        updateBody
      );

      let response = { routeRole: routeRoleCnt };
      return response;
    } else {
      return { projectroute: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter, updateBody) => {
  try {
    const routeRoleCnt = await dbService.updateMany(RouteRole, filter);
    return { routeRole: routeRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter, updateBody) => {
  try {
    const userRoleCnt = await dbService.updateMany(UserRole, filter);
    return { userRole: userRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser_activity,
  deletePurchase,
  deleteProduct,
  deletePayment,
  deleteCredit,
  deleteActivity,
  deleteUser,
  deletePushNotification,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser_activity,
  countPurchase,
  countProduct,
  countPayment,
  countCredit,
  countActivity,
  countUser,
  countPushNotification,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser_activity,
  softDeletePurchase,
  softDeleteProduct,
  softDeletePayment,
  softDeleteCredit,
  softDeleteActivity,
  softDeleteUser,
  softDeletePushNotification,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
