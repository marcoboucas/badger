import { Badge, Connector, Metric } from '@badger/common';
import { CodingameConfig } from './config';

import { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { TMP_FOLDER } from '../../../config';
import { axiosInstance } from '../axios-instance';
import { CodingameStats, RawCodingameBadge } from './types';

export class CodingameConnector implements Connector {
  debug: boolean;
  config: CodingameConfig;
  name = 'Codingame';
  website = 'https://www.codingame.com/';

  private readonly baseUrl = 'https://www.codingame.com';
  private readonly badgesUrl = '/services/Achievement/findByCodingamerId';
  private readonly statsurl =
    '/services/CodinGamer/findCodingamePointsStatsByHandle';

  constructor(config: CodingameConfig, debug: boolean = false) {
    this.config = config;
    this.debug = debug;
  }

  private async getBadges(): Promise<Badge[]> {
    const response = await this.getAxiosInstance().post(
      `${this.baseUrl}${this.badgesUrl}`,
      `[${this.config.userId}]`,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );
    if (this.debug) {
      writeFileSync(
        join(TMP_FOLDER, 'codingame-badges.json'),
        JSON.stringify(response.data, null, 2),
      );
    }

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
    const response = await this.getAxiosInstance().post(
      `${this.baseUrl}${this.statsurl}`,
      `[${this.config.longUserId}]`,
      {
        headers: {
          authority: 'www.codingame.com',
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,fr;q=0.8,fr-FR;q=0.7,pl;q=0.6',
          'content-type': 'application/json;charset=UTF-8',
          origin: this.baseUrl,
          referer: `${this.baseUrl}${this.statsurl}`,
        },
      },
    );
    const stats = response.data as CodingameStats;
    if (this.debug) {
      writeFileSync(
        join(TMP_FOLDER, 'codingame-stats.json'),
        JSON.stringify(stats, null, 2),
      );
    }
    return [
      {
        source: 'codingame',
        id: 'codingame-points',
        name: 'Codingame Points',
        description: 'Codingame Points',
        updateDate: new Date(),
        value: stats.codingamerPoints,
      },
      {
        source: 'codingame',
        id: 'codingame-level',
        name: 'Codingame Level',
        description: 'Codingame Level',
        updateDate: new Date(),
        value: stats.codingamer.level,
      },
      {
        source: 'codingame',
        id: 'codingame-rank',
        name: 'Codingame Rank (Top)',
        description: 'Codingame Rank',
        updateDate: new Date(),
        isPercent: true,
        value:
          stats.codingamePointsRankingDto.codingamePointsRank /
          stats.codingamePointsRankingDto.numberCodingamersGlobal,
      },
    ] as Metric[];
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
