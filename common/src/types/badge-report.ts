import { Badge } from "./badge";

export interface BadgeReport {
  name: string;
  website: string;
  badges: Badge[];
  badgesPercentage: number;
  badgesAcquired: number;
  badgesTotal: number;
  pointsPercentage: number;
  pointsAcquired: number;
  pointsTotal: number;
}
