import { DataReport } from "@badger/common";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { useMemo } from "react";
import BadgeCard from "../BadgeCard";
import MetricCard from "../MetricCard";
import styles from "./WebsiteBadges.module.css";
interface WebsiteBadgesProps {
  report: DataReport;
  displayAvailable: boolean;
  displayMetrics: boolean;
  displayBadges: boolean;
}

const WebsiteBadges = (props: WebsiteBadgesProps) => {
  const { report, displayAvailable } = props;
  const badges = useMemo(() => {
    if (!props.displayBadges) {
      return [];
    }
    const badges = report.badges
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
    return badges;
  }, [report, displayAvailable, props.displayBadges]);

  const metrics = useMemo(() => {
    if (!props.displayMetrics) {
      return [];
    }
    const metrics = report.metrics ?? [];
    return metrics;
  }, [report, props.displayMetrics]);

  return (
    <div>
      <div className={styles.header}>
        <a href={report.website} style={{ textDecoration: "none" }}>
          <h3 className={styles.title}>{report.name}</h3>
        </a>
        <Chip
          label={`${report.badgesPercentage ?? "N/A"} %`}
          variant="outlined"
          sx={{ width: "4rem" }}
        />
        <div className={styles["progress-bar-container"]}>
          <LinearProgress
            color="primary"
            variant="determinate"
            value={report.badgesPercentage}
          />
        </div>
      </div>
      <div className={styles.badges}>
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className={styles.badges}>
        {badges.map((badge) => (
          <BadgeCard key={badge.name} badge={badge} />
        ))}
      </div>
    </div>
  );
};
export default WebsiteBadges;
