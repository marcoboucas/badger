import { ConnectorConfig } from '@badger/common';

export interface GarminConfig extends ConnectorConfig {
  name: 'garmin';
  login: string;
  password: string;
}
