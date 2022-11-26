import { ConnectorConfig } from '@badger/common';

export interface VelibConfig extends ConnectorConfig {
  name: 'velib';
  username: string;
  password: string;
}
