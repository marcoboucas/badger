import { Badge } from "@badger/common";
import styled from "@emotion/styled";
import { Badge as BadgeComponent } from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import clsx from "clsx";
import "./BadgeCard.css";
interface BadgeCardProps {
  badge: Badge;
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9f5",
    maxWidth: 220,
    border: "1px solid #dadde9",
  },
}));

function BadgeCard(props: BadgeCardProps) {
  const { badge } = props;

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
    >
      <div className="container">
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
