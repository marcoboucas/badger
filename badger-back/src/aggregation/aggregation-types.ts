import {
  CodingameConfig,
  CodingameConnector,
  GarminConfig,
  GarminConnector,
} from './connectors';

export type AllConfigurationsType = CodingameConfig | GarminConfig;

export type AllConnectorsType = CodingameConnector | GarminConnector;
