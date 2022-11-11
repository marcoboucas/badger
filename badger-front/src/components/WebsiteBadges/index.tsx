import { BadgeReport } from "@badger/common";
import Chip from "@mui/material/Chip";
import { useMemo } from "react";
import BadgeCard from "../BadgeCard";
import styles from "./WebsiteBadges.module.css";
interface WebsiteBadgesProps {
  report: BadgeReport;
}

const WebsiteBadges = (props: WebsiteBadgesProps) => {
  const { report } = props;

  const badges = useMemo(() => {
    return report.badges
      .filter((badge) => badge.acquired)
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  }, [report]);

  const badgesCount = useMemo(() => {
    return report.badges.length;
  }, [report]);
  const acquiredBadgesCount = useMemo(() => {
    return badges.length;
  }, [badges]);

  const percentageSuccess = useMemo(() => {
    return Math.round((acquiredBadgesCount / badgesCount) * 100);
  }, [acquiredBadgesCount, badgesCount]);
  return (
    <div>
      <h3 className={styles.title}>
        {report.name}{" "}
        <Chip label={`${percentageSuccess} %`} variant="outlined" />
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
