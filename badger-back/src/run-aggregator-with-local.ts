import { User } from '@badger/common';
import * as fs from 'fs';
import { Aggregator } from './aggregation/aggregator';

const main = async (): Promise<void> => {
  const userData: User = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const aggregator = new Aggregator(userData.configs as any);
  const badges = await aggregator.getBadges();
  fs.writeFileSync(
    '../badger-front/public/badges.json',
    JSON.stringify(badges, null, 2),
  );
};

void main();
