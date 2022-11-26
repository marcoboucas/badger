import {
  CodingameConfig,
  CodingameConnector,
  GarminConfig,
  GarminConnector,
  TrailheadConfig,
  TrailheadConnector,
  VelibConfig,
  VelibConnector,
} from './connectors';

export type AllConfigurationsType =
  | CodingameConfig
  | GarminConfig
  | TrailheadConfig
  | VelibConfig;

export type AllConnectorsType =
  | CodingameConnector
  | GarminConnector
  | TrailheadConnector
  | VelibConnector;
