import { BadgeReport } from "@badger/common";
import Chip from "@mui/material/Chip";
import { useMemo } from "react";
import BadgeCard from "../BadgeCard";
import styles from "./WebsiteBadges.module.css";
interface WebsiteBadgesProps {
  report: BadgeReport;
  displayAvailable: boolean;
}

const WebsiteBadges = (props: WebsiteBadgesProps) => {
  const { report, displayAvailable } = props;

  const badges = useMemo(() => {
    return report.badges
      .filter((x) => {
        return displayAvailable ? true : x.acquired;
      })
      .sort((a, b) => {
        if (a.acquired && !b.acquired) {
          return -1;
        }
        if (!a.acquired && b.acquired) {
          return 1;
        }
        return (b.weight ?? 0) - (a.weight ?? 0);
      });
  }, [report, displayAvailable]);

  return (
    <div>
      <h3 className={styles.title}>
        {report.name}{" "}
        <Chip label={`${report.badgesPercentage} %`} variant="outlined" />
      </h3>
      <div className={styles.badges}>
        {badges.map((badge) => (
          <BadgeCard key={badge.name} badge={badge} />
        ))}
      </div>
    </div>
  );
};
export default WebsiteBadges;
