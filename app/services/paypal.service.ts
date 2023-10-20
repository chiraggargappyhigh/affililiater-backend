import AffiliateService from "./affiliate.service";
import axios, { AxiosInstance } from "axios";
import { config } from "../../config";
import FormData from "form-data";

class PaypalService {
  private affiliateService: AffiliateService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.affiliateService = new AffiliateService();
    this.axiosInstance = axios.create({
      baseURL: config.paypalUrl,
    });
  }

  private async getAccessToken(authCode: string) {
    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", authCode);
    const { data } = await this.axiosInstance.post(
      "/v1/identity/openidconnect/tokenservice",
      formData,
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

    console.log("data", data);
    return data;
  }

  public async connectPaypal(affiliateId: string, authCode: string) {
    const token = await this.getAccessToken(authCode);
    const userData = await this.getUserData(token);
    return;
    const affiliate = await this.affiliateService.update(affiliateId, {
      $set: {
        payment: {
          paypalEmail: userData.email,
          paypalId: userData.user_id,
        },
      },
    });
    return affiliate;
  }
}

export default PaypalService;
