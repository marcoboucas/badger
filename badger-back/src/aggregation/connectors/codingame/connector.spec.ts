import { User } from '@badger/common';
import * as fs from 'fs';
import { CodingameConfig } from './config';
import { CodingameConnector } from './connector';

describe('Codingame Connector', () => {
  let codingameConfig: CodingameConfig;
  beforeAll(() => {
    // Load dotenv
    const userData: User = JSON.parse(
      fs.readFileSync('./src/config.json', 'utf8'),
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
    const badges = await connector.getBadges();
    expect(badges).toBeDefined();
  });
});
