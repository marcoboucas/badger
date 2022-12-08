import { ConnectorConfig } from '@badger/common';

export interface KaggleConfig extends ConnectorConfig {
  name: 'kaggle';
  username: string;
}
