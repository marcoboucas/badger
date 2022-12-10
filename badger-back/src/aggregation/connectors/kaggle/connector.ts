import { Badge, Connector, Metric } from '@badger/common';
import { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { TMP_FOLDER } from '../../../config';
import { axiosInstance } from '../axios-instance';
import { KaggleConfig } from './config';

export class KaggleConnector implements Connector {
  config: KaggleConfig;
  name = 'Kaggle';
  website = 'https://www.kaggle.com';
  debug: boolean;

  constructor(config: KaggleConfig, debug: boolean = false) {
    this.config = config;
    this.debug = debug;
  }

  async getData(): Promise<{ badges: Badge[]; metrics: Metric[] }> {
    const url = this.getProfileUrl(this.config.username);

    const instance = this.getAxiosInstance();

    const response = await instance.get(url);
    let htmlCode: string = response.data;
    htmlCode = htmlCode.slice(
      htmlCode.indexOf('data-component-name="ProfileContainerReact"'),
    );
    const begin = 'Kaggle.State.push(';
    htmlCode = htmlCode.slice(htmlCode.indexOf(begin) + begin.length);
    htmlCode = htmlCode.slice(
      0,
      htmlCode.indexOf(');performance && performance.mark'),
    );

    const data = JSON.parse(htmlCode);
    if (this.debug) {
      writeFileSync(
        join(TMP_FOLDER, 'kaggle-webpage.json'),
        JSON.stringify(data, null, 2),
      );
    }

    return {
      badges: [],
      metrics: [
        {
          id: 'kaggle-competitions-nbr',
          name: 'Compétitions',
          value: data.competitionsSummary.totalResults ?? 0,
          source: 'kaggle',
          updateDate: new Date(),
          description: 'Nombre de compétitions auxquelles vous avez participé',
        },
        {
          id: 'kaggle-competitions-rank-percent',
          name: 'Rank',
          value: data.competitionsSummary.rankPercentage,
          source: 'kaggle',
          updateDate: new Date(),
          isPercent: true,
          description:
            'Rang moyen dans les compétitions auxquelles vous avez participé',
        },
      ],
    };
  }

  private getProfileUrl(username: string): string {
    return `https://www.kaggle.com/${username}`;
  }

  private getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }
}
