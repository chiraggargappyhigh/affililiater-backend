import AuthMiddleware from "./auth.middleware";
import ProductMiddleware from "./product.middleware";
import AffiliateMiddleware from "./affiliate.middleware";

const authMiddleware = new AuthMiddleware();
const productMiddleware = new ProductMiddleware();
const affiliateMiddleware = new AffiliateMiddleware();

export { authMiddleware, productMiddleware, affiliateMiddleware };
