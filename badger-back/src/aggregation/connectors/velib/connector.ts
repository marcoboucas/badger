import { Badge, Connector, Metric } from '@badger/common';
import { VelibConfig } from './config';

import { AxiosInstance } from 'axios';
import { axiosInstance } from '../axios-instance';

export class VelibConnector implements Connector {
  config: VelibConfig;
  name = 'Velib';
  website = 'https://www.velib-metropole.fr/';

  private readonly allUserInfosUrl =
    'https://www.velib-metropole.fr/webapi/private/getAllInfosUser';

  constructor(config: VelibConfig) {
    this.config = config;
  }

  public async getData(): Promise<{ badges: Badge[]; metrics: Metric[] }> {
    return {
      badges: [],
      metrics: await this.getMetrics(),
    };
  }

  private async getMetrics(): Promise<Metric[]> {
    // NOT WORKING BECAUSE OF CLOUDFLARE
    // const response = await this.getAxiosInstance().get(this.allUserInfosUrl, {
    //   headers: {
    //     Cookie: await this.getCookies(),
    //   },
    // });
    // console.log(response.status);
    // console.log(response.data);
    return [
      {
        name: 'Km parcourus',
        value: 58.8,
        unit: 'km',
        description: 'Kilomètres parcourus en vélo',
        id: 'velib-km-parcourus',
        source: 'velib',
        updateDate: new Date(),
      },
      {
        name: 'CO2 économisé',
        value: 6.5,
        unit: 'kg',
        description: 'Kilogrammes de CO2 économisés',
        id: 'velib-co2-economise',
        source: 'velib',
        updateDate: new Date(),
      },
    ];
  }
}
