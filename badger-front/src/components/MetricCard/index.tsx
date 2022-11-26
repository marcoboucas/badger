import {  Metric } from "@badger/common";
import { Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import classes from "./MetricCard.module.css";
import CustomTooltip from "../CustomTooltip";
interface MetricCardProps {
  metric: Metric;
}

function MetricCard(props: MetricCardProps) {
  const { metric } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <CustomTooltip
      title={<div className="tooltip">
      <p color="inherit" className="tooltip-title">
        {metric.name}
      </p>
      <p color="inherit" className="tooltip-content">
        {metric.description}
      </p>
    </div>}
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      >
    <Card className={classes.container}>
      <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {metric.name}
      </Typography>
      <Typography variant="h5" component="div">
      {metric.value} {metric.unit ?? ""}
      </Typography>
      {/* <Typography variant="body2">
        {metric.description}
      </Typography> */}
    </CardContent>
    </Card>
    </CustomTooltip>
  );
}
export default MetricCard;
