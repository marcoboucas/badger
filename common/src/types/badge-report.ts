import { Badge } from "./badge";
import {Metric} from "./metric";

export interface DataReport {
  name: string;
  website: string;
  badges: Badge[];
  metrics: Metric[];
  badgesPercentage: number;
  badgesAcquired: number;
  badgesTotal: number;
  pointsPercentage: number;
  pointsAcquired: number;
  pointsTotal: number;
}
