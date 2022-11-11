import { Badge } from "@badger/common";
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
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
            {badge.name}
          </p>
          <p color="inherit" className="tooltip-content">
            {badge.description}
          </p>
        </div>
      }
    >
      <div className="container">
        <img className="image" src={badge.image} alt={badge.name} />
      </div>
    </CustomTooltip>
  );
}
export default BadgeCard;
