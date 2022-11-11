import { Badge } from "./badge";
import { ConnectorConfig } from "./connector-config";

export interface Connector {
  name: string;
  website: string;
  config: ConnectorConfig;
  getBadges: () => Promise<Badge[]>;
}
