import { ConnectorConfig } from '@badger/common';

export interface TrailheadConfig extends ConnectorConfig {
  name: 'trailhead';
  userId: string;
}
