import { Badge, Connector } from '@badger/common';
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
  config: CodingameConfig;
  name = 'Codingame';
  website = 'https://www.codingame.com/';

  private readonly baseUrl = 'https://www.codingame.com';
  private readonly badgesUrl = '/services/Achievement/findByCodingamerId';

  constructor(config: CodingameConfig) {
    this.config = config;
  }

  public async getBadges(): Promise<Badge[]> {
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
      if (badge.progress > 0) {
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

  private getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }
}
