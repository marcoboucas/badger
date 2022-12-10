import { User } from '@badger/common';
import * as fs from 'fs';
import { CONFIG_FILE } from '../../../config';
import { DuolingoConfig } from './config';
import { DuolingoConnector } from './connector';

describe('Duolingo Connector', () => {
  let config: DuolingoConfig;
  beforeAll(() => {
    // Load dotenv
    const userData: User<DuolingoConfig> = JSON.parse(
      fs.readFileSync(CONFIG_FILE, 'utf8'),
    );
    const customConfig = userData.configs.find(
      (config) => config.name === 'duolingo',
    );
    if (customConfig == null) {
      throw new Error('No Duolingo config found');
    }
    config = customConfig as DuolingoConfig;
  });

  it('should be able to request the data', async () => {
    const connector = new DuolingoConnector(config);
    const data = await connector.getData();
    expect(data).toBeDefined();
  });
});
