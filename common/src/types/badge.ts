import { ConnectorType } from "./connector-types";

interface BaseBadge {
  source: ConnectorType;
  id: string;
  name: string;
  description: string;
  image: string;
  isSquare: boolean;
  weight?: number;
}

interface AcquiredBadge extends BaseBadge {
  acquired: true;
  acquisitionDate: Date;
}

interface NotAcquiredBadge extends BaseBadge {
  acquired: false;
}

export type Badge = AcquiredBadge | NotAcquiredBadge;
