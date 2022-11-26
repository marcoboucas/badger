import { Badge, Connector, Metric } from '@badger/common';
import { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { axiosInstance } from '../axios-instance';
import { DuolingoConfig } from './config';

export class DuolingoConnector implements Connector {
  name = 'Duolingo';
  website = 'https://www.duolingo.com/';

  config: DuolingoConfig;
  loginUrl = 'https://www.duolingo.com/login';
  userBaseUrl = 'https://duolingo-achievements-prod.duolingo.com/users/';
  requestFields =
    'fromLanguage=fr&hasPlus=0&isAgeRestricted=0&isProfilePublic=1&isSchools=0&learningLanguage=es';

  constructor(config: DuolingoConfig) {
    this.config = config;
  }

  private async getBadges(): Promise<Badge[]> {
    const axios = this.getAxiosInstance();

    // Connect
    const { userId, jwtToken } = await this.connect(axios);

    // get the user data
    const response = await axios.get(this.userUrl(userId), {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.status !== 200) {
      throw new Error(`Error while connecting to ${this.userUrl(userId)}`);
    }
    console.log(response.data);
    writeFileSync('duolingo.json', JSON.stringify(response.data, null, 2));
    return [];
  }

  private async getMetrics(): Promise<Metric[]> {
    return [];
  }

  public async getData(): Promise<{ badges: Badge[]; metrics: Metric[] }> {
    return {
      badges: await this.getBadges(),
      metrics: await this.getMetrics(),
    };
  }

  private getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }

  private async connect(
    axios: AxiosInstance,
  ): Promise<{ userId: string; jwtToken: string }> {
    const response = await axios.post(this.loginUrl, {
      login: this.config.login,
      password: this.config.password,
    });
    if (response.status !== 200) {
      throw new Error(`Error while connecting to ${this.loginUrl}`);
    }
    return {
      userId: response.data.user_id,
      jwtToken: response.headers.jwt,
    };
  }

  userUrl(userId: string): string {
    return (
      this.userBaseUrl +
      userId +
      '/achievements?' +
      this.requestFields +
      '&_=' +
      Date.now().toString()
    );
  }
}
