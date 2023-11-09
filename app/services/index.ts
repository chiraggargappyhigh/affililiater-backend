import FirebaseService from "./firebase.service";
import UserService from "./user.service";
import ProductService from "./product.service";
import AffiliateService from "./affiliate.service";
import TransactionService from "./transaction.service";
import RedirectService from "./redirect.service";
import PayoutService from "./payout.service";
import PaypalService from "./paypal.service";

const firebaseService = new FirebaseService();
const userService = new UserService();
const productService = new ProductService();
const affiliateService = new AffiliateService();
const transactionService = new TransactionService();
const redirectService = new RedirectService();
const payoutService = new PayoutService();
const paypalService = new PaypalService();

export {
  firebaseService,
  userService,
  productService,
  affiliateService,
  transactionService,
  redirectService,
  payoutService,
  paypalService,
};
