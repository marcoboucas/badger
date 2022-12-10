import { ConnectorConfig } from '@badger/common';

export interface CodingameConfig extends ConnectorConfig {
  name: 'codingame';
  userId: string;
  longUserId: string;
}
