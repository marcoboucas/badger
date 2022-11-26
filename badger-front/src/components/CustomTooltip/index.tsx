
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import styled from "@emotion/styled";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9f5",
      maxWidth: 220,
      border: "1px solid #dadde9",
    },
  }));
  export default CustomTooltip;