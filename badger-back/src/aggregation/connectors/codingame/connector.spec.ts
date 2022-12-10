import { User } from '@badger/common';
import * as fs from 'fs';
import { CONFIG_FILE } from '../../../config';
import { CodingameConfig } from './config';
import { CodingameConnector } from './connector';

describe('Codingame Connector', () => {
  let codingameConfig: CodingameConfig;
  beforeAll(() => {
    // Load dotenv
    const userData: User<CodingameConfig> = JSON.parse(
      fs.readFileSync(CONFIG_FILE, 'utf8'),
    );
    const customConfig = userData.configs.find(
      (config) => config.name === 'codingame',
    );
    if (customConfig == null) {
      throw new Error('No Codingame config found');
    }
    codingameConfig = customConfig as CodingameConfig;
  });

  it('should be able to request the badges', async () => {
    const connector = new CodingameConnector(codingameConfig);
    const data = await connector.getData();
    expect(data).toBeDefined();
  });
});
