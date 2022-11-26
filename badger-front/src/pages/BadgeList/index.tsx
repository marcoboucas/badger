import { DataReport } from "@badger/common";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import { getBadgesReports } from "../../api/badges";
import WebsiteBadges from "../../components/WebsiteBadges";
import styles from "./BadgeList.module.css";

const BadgeListPage = () => {
  const [reports, setReports] = useState<DataReport[]>([]);
  const [displayAvailable, setDisplayAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const reports = await getBadgesReports();
      setReports(reports);
    })();
  }, []);
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Badges</h2>
      <Typography className={styles.description}>
        Tous mes badges sur une seule page, pour voir ma progression
      </Typography>
      <div className={styles.controls}>
        <ToggleButton
          value="check"
          selected={displayAvailable}
          onChange={() => {
            setDisplayAvailable((x) => !x);
          }}
        >
          <FilterListIcon />
        </ToggleButton>
      </div>
      <div className={styles.badges}>
        {reports.map((report) => (
          <WebsiteBadges
            key={report.name}
            report={report}
            displayAvailable={displayAvailable}
          />
        ))}
      </div>
    </div>
  );
};
export default BadgeListPage;
