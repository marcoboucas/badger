import { DataReport } from "@badger/common";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import { getBadgesReports } from "../../api/badges";
import WebsiteBadges from "../../components/WebsiteBadges";
import styles from "./BadgeList.module.css";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ScoreIcon from '@mui/icons-material/Score';

const BadgeListPage = () => {
  const [reports, setReports] = useState<DataReport[]>([]);
  const [displayAvailable, setDisplayAvailable] = useState(false);
  const [displayBadges, setDisplayBadges] = useState(true);
  const [displayMetrics, setDisplayMetrics] = useState(true);
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
          selected={!displayAvailable}
          onChange={() => {
            setDisplayAvailable((x) => !x);
          }}
        >
          <FilterListIcon />
        </ToggleButton>
        <ToggleButton
          value="badges"
          selected={displayBadges}
          onChange={() => {
            setDisplayBadges((x) => !x);
          }}
        >
          <MilitaryTechIcon />
        </ToggleButton>
        <ToggleButton
          value="metrics"
          selected={displayMetrics}
          onChange={() => {
            setDisplayMetrics((x) => !x);
          }}
        >
          <ScoreIcon />
        </ToggleButton>
      </div>
      <div className={styles.badges}>
        {reports.map((report) => (
          <WebsiteBadges
            key={report.name}
            report={report}
            displayAvailable={displayAvailable}
            displayBadges={displayBadges}
            displayMetrics={displayMetrics}
          />
        ))}
      </div>
    </div>
  );
};
export default BadgeListPage;
