import { affiliateService, productService } from ".";
import axios, { AxiosInstance, AxiosError } from "axios";
import { config } from "../../config";
import qs from "qs";

class PaypalService {
  private affiliateService: typeof affiliateService = affiliateService;
  private productService: typeof productService = productService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.paypalUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  private async getAccessToken(authCode: string) {
    const { data } = await this.axiosInstance.post(
      "/v1/identity/openidconnect/tokenservice",
      qs.stringify({
        grant_type: "authorization_code",
        code: authCode,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.paypalClientId}:${config.paypalClientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    const token = data.access_token;
    return token;
  }

  private async getUserData(token: string) {
    const { data } = await this.axiosInstance.get(
      "/v1/oauth2/token/userinfo?schema=openid",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  }

  private async getAppAccessToken() {
    const { data } = await this.axiosInstance.post(
      "/v1/oauth2/token",
      qs.stringify({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.paypalClientId}:${config.paypalClientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    const token = data.access_token;
    return token;
  }

  public async connectPaypal(affiliateId: string, authCode: string) {
    const token = await this.getAccessToken(authCode);
    const userData = await this.getUserData(token);
    const affiliate = await this.affiliateService.update(affiliateId, {
      $set: {
        payout: {
          paypalEmail: userData.email,
          paypalName: userData.name,
        },
      },
    });
    return affiliate.payout;
  }

  public async initiatePayout(
    amount: number,
    paypalEmail: string,
    userId: string,
    productId: string
  ) {
    const identifier = `Payout_${userId}_${Date.now()}`;
    const product = await this.productService.getProduct(productId);
    try {
      const response = await this.axiosInstance.post(
        "/v1/payments/payouts",
        JSON.stringify({
          sender_batch_header: {
            sender_batch_id: identifier,
            email_subject: `Payout from ${product.name}`,
            email_message: `You have received a payout of $${amount} from ${product.name}`,
          },
          items: [
            {
              recipient_type: "EMAIL",
              amount: {
                value: amount.toFixed(2),
                currency: "USD",
              },
              receiver: paypalEmail,
              note: `Payout from ${product.name}`,
              sender_item_id: `${identifier}_item`,
            },
          ],
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await this.getAppAccessToken()}`,
          },
        }
      );

      console.log(response);
      return {
        batchId: response?.data.batch_header.payout_batch_id,
        senderBatchId:
          response?.data.batch_header.sender_batch_header.sender_batch_id,
        batchStatus: response?.data.batch_header.batch_status,
      };
    } catch (error) {
      console.log((error as AxiosError).response?.data);
      throw new Error("Error initiating payout");
    }
  }
}

export default PaypalService;
