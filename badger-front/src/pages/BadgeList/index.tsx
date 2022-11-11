import { BadgeReport } from "@badger/common";
import { useEffect, useState } from "react";
import { getBadgesReports } from "../../api/badges";
import WebsiteBadges from "../../components/WebsiteBadges";
import "./BadgeList.css";

const BadgeListPage = () => {
  const [reports, setReports] = useState<BadgeReport[]>([]);

  useEffect(() => {
    (async () => {
      const reports = await getBadgesReports();
      setReports(reports);
    })();
  }, []);
  return (
    <div className="root">
      <h2 className="title">Badges</h2>
      <div className="badges">
        {reports.map((report) => (
          <WebsiteBadges key={report.name} report={report} />
        ))}
      </div>
    </div>
  );
};
export default BadgeListPage;
