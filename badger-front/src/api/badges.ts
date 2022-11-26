import { DataReport } from "@badger/common";

export const getBadgesReports = async (): Promise<DataReport[]> => {
  const response = await fetch("/badges.json");
  const badges = await response.json();
  return badges;
};
