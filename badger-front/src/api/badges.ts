import { BadgeReport } from "@badger/common";

export const getBadgesReports = async (): Promise<BadgeReport[]> => {
  const response = await fetch("/badges.json");
  const badges = await response.json();
  return badges;
};
