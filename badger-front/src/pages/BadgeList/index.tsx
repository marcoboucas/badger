import { BadgeReport } from "@badger/common";
import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import { useEffect, useState } from "react";
import { getBadgesReports } from "../../api/badges";
import WebsiteBadges from "../../components/WebsiteBadges";
import "./BadgeList.css";

const BadgeListPage = () => {
  const [reports, setReports] = useState<BadgeReport[]>([]);
  const [displayAvailable, setDisplayAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const reports = await getBadgesReports();
      setReports(reports);
    })();
  }, []);
  return (
    <div className="root">
      <h2 className="title">Badges</h2>
      <div>
        <ToggleButton
          value="check"
          selected={displayAvailable}
          onChange={() => {
            setDisplayAvailable((x) => !x);
          }}
        >
          <FilterListIcon />
          {displayAvailable ? "Display Acquired" : "Display All"}
        </ToggleButton>
      </div>
      <div className="badges">
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
