import AffiliateService from "./affiliate.service";
import axios, { AxiosInstance } from "axios";
import { config } from "../../config";
import qs from "qs";

class PaypalService {
  private affiliateService: AffiliateService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.affiliateService = new AffiliateService();
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
}

export default PaypalService;
