import {
  CodingameConfig,
  CodingameConnector,
  GarminConfig,
  GarminConnector,
  KaggleConfig,
  KaggleConnector,
  TrailheadConfig,
  TrailheadConnector,
  VelibConfig,
  VelibConnector,
} from './connectors';

export type AllConfigurationsType =
  | CodingameConfig
  | GarminConfig
  | TrailheadConfig
  | VelibConfig
  | KaggleConfig;

export type AllConnectorsType =
  | CodingameConnector
  | GarminConnector
  | TrailheadConnector
  | VelibConnector
  | KaggleConnector;
