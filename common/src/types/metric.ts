import {ConnectorType} from "./connector-types";

export interface Metric{
  source: ConnectorType;
  id: string;
  name: string;
  description: string;
  updateDate: Date;
  value: number;

  unit?: string;
  isPercent?: boolean;

  image?: string;
  isSquare?: boolean;
}