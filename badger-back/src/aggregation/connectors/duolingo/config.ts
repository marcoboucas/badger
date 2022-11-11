import { ConnectorConfig } from '@badger/common';

export interface DuolingoConfig extends ConnectorConfig {
  name: 'duolingo';
  login: string;
  password: string;
}
