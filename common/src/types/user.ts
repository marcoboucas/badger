import { ConnectorConfig } from './connector-config';

export interface User {
  id: string;
  name: string;
  configs: ConnectorConfig[];
}
