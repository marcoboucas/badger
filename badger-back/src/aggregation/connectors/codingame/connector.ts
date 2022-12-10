import { Badge, Connector, Metric } from '@badger/common';
import { CodingameConfig } from './config';

import { AxiosInstance } from 'axios';
import { axiosInstance } from '../axios-instance';

interface RawCodingameBadge {
  id: string;
  title: string;
  description: string;
  imageBinaryId: string;
  completionTime: number;
  progress: number;
  weight: number;
}

export class CodingameConnector implements Connector {
  debug: boolean;
  config: CodingameConfig;
  name = 'Codingame';
  website = 'https://www.codingame.com/';

  private readonly baseUrl = 'https://www.codingame.com';
  private readonly badgesUrl = '/services/Achievement/findByCodingamerId';

  constructor(config: CodingameConfig, debug: boolean = false) {
    this.config = config;
    this.debug = debug;
  }

  private async getBadges(): Promise<Badge[]> {
    const response = await this.getAxiosInstance().post(
      `${this.baseUrl}${this.badgesUrl}`,
      `[${this.config.userId}]`,
    );

    return response.data.map((badge: RawCodingameBadge) => {
      const baseBadge = {
        source: 'codingame',
        id: badge.id,
        name: badge.title,
        description: badge.description,
        image: `https://static.codingame.com/servlet/fileservlet?id=${badge.imageBinaryId}`,
        isSquare: true,
        weight: Math.floor(badge.weight / 100), // TOO BIG
      };
      if (
        badge.completionTime !== undefined &&
        badge.completionTime !== null &&
        badge.completionTime !== 0
      ) {
        return {
          ...baseBadge,
          acquired: true,
          acquisitionDate: new Date(badge.completionTime),
        };
      } else {
        return {
          ...baseBadge,
          acquired: false,
        };
      }
    });
  }

  private async getMetrics(): Promise<Metric[]> {
    return [] as Metric[];
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
}
