import {
  CodingameConfig,
  CodingameConnector,
  GarminConfig,
  GarminConnector,
  TrailheadConfig,
  TrailheadConnector,
} from './connectors';

export type AllConfigurationsType =
  | CodingameConfig
  | GarminConfig
  | TrailheadConfig;

export type AllConnectorsType =
  | CodingameConnector
  | GarminConnector
  | TrailheadConnector;
