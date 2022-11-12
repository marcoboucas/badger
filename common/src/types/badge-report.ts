import { Badge } from "./badge";

export interface BadgeReport {
  name: string;
  website: string;
  badges: Badge[];
  percentage: number;
  pointsAcquired: number;
  pointsTotal: number;
}
