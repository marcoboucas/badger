import { User } from '@badger/common';
import * as fs from 'fs';
import { AllConfigurationsType } from './aggregation/aggregation-types';
import { Aggregator } from './aggregation/aggregator';

const main = async (filters?: string[]): Promise<void> => {
  const userData: User<AllConfigurationsType> = JSON.parse(
    fs.readFileSync('./local-config.json', 'utf8'),
  );

  // Filter configs if needed
  if (filters !== undefined && filters.length > 0) {
    userData.configs = userData.configs.filter((config) =>
      filters.includes(config.name),
    );
  }

  const aggregator = new Aggregator(userData.configs as any);
  const data = await aggregator.getData(true);
  fs.writeFileSync(
    '../badger-front/public/badges.json',
    JSON.stringify(data, null, 2),
  );
};

void main();
