import { User } from '@badger/common';
import * as fs from 'fs';
import { DuolingoConfig } from './config';
import { DuolingoConnector } from './connector';

describe('Duolingo Connector', () => {
  let config: DuolingoConfig;
  beforeAll(() => {
    // Load dotenv
    const userData: User = JSON.parse(
      fs.readFileSync('./src/config.json', 'utf8'),
    );
    const customConfig = userData.configs.find(
      (config) => config.name === 'duolingo',
    );
    if (customConfig == null) {
      throw new Error('No Duolingo config found');
    }
    config = customConfig as DuolingoConfig;
  });

  it('should be able to request the badges', async () => {
    const connector = new DuolingoConnector(config);
    const badges = await connector.getBadges();
    expect(badges).toBeDefined();
  });
});
