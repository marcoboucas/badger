import { Badge } from "./badge";
import { ConnectorConfig } from "./connector-config";
import {Metric} from "./metric";

export interface Connector {
  name: string;
  website: string;
  config: ConnectorConfig;
  getData: () => Promise<{badges: Badge[], metrics: Metric[]}>;
}
