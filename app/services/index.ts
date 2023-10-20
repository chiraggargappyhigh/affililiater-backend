import FirebaseService from "./firebase.service";
import UserService from "./user.service";
import ProductService from "./product.service";
import AffiliateService from "./affiliate.service";
import TransactionService from "./transaction.service";
import RedirectService from "./redirect.service";
import PayoutService from "./payout.service";
import PaypalService from "./paypal.service";
const firebaseService = new FirebaseService();

export {
  firebaseService,
  FirebaseService,
  UserService,
  ProductService,
  AffiliateService,
  TransactionService,
  PayoutService,
  RedirectService,
  PaypalService,
};
