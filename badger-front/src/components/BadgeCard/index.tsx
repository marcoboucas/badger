import { Badge } from "@badger/common";
import { Badge as BadgeComponent } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import "./BadgeCard.css";
import CustomTooltip from "../CustomTooltip";
interface BadgeCardProps {
  badge: Badge;
}


function BadgeCard(props: BadgeCardProps) {
  const { badge } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <CustomTooltip
      title={
        <div className="tooltip">
          <p color="inherit" className="tooltip-title">
            {badge.name} ({badge.weight})
          </p>
          <p color="inherit" className="tooltip-content">
            {badge.description}
          </p>
        </div>
      }
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
    >
      <div className="container" onClick={() => setShowTooltip(!showTooltip)}>
        <BadgeComponent
          badgeContent={badge.weight}
          color={badge.acquired ? "success" : "error"}
          max={99999}
        >
          <img
            className={clsx(
              "image",
              badge.acquired ? "image-acquired" : "image-available"
            )}
            loading="lazy"
            src={badge.image}
            alt={badge.name}
          />
        </BadgeComponent>
      </div>
    </CustomTooltip>
  );
}
export default BadgeCard;
