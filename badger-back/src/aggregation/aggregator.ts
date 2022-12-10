import { Connector, DataReport } from '@badger/common';
import { AllConfigurationsType } from './aggregation-types';
import {
  GarminConnector,
  TrailheadConnector,
  VelibConnector,
} from './connectors';
import { CodingameConnector } from './connectors/codingame/connector';

export class Aggregator {
  constructor(private readonly configurations: AllConfigurationsType[]) {}

  public async getData(debug: boolean = false): Promise<DataReport[]> {
    return (
      await Promise.all(
        this.configurations.map(async (config) => {
          try {
            return await this.getDataReportFromConfig(config, debug);
          } catch (e) {
            console.error(e);
            return null;
          }
        }),
      )
    ).filter((x): x is DataReport => x !== null);
  }

  private async getDataReportFromConfig(
    config: AllConfigurationsType,
    debug: boolean = false,
  ): Promise<DataReport> {
    console.info(`Retrieving data from ${config.name}...`);
    const connector = this.getConnector(config, debug);
    const { badges, metrics } = await connector.getData();

    // Points
    const pointsAcquired = badges
      .filter((badge) => badge.acquired)
      .reduce((acc, badge) => acc + (badge.weight ?? 0), 0);
    const pointsTotal = badges.reduce(
      (acc, badge) => acc + (badge.weight ?? 0),
      0,
    );
    const pointsPercentage =
      Math.floor((pointsAcquired / pointsTotal) * 100) ?? 0;

    // Badges
    const badgesAcquired = badges.filter((badge) => badge.acquired).length;
    const badgesTotal = badges.length;
    const badgesPercentage =
      Math.floor((badgesAcquired / badgesTotal) * 100) ?? 0;

    return {
      name: connector.name,
      website: connector.website,
      badges,
      metrics,
      pointsAcquired,
      pointsTotal,
      pointsPercentage,
      badgesAcquired,
      badgesTotal,
      badgesPercentage,
    };
  }

  private getConnector(
    config: AllConfigurationsType,
    debug: boolean = false,
  ): Connector {
    switch (config.name) {
      case 'codingame':
        return new CodingameConnector(config, debug);
      case 'garmin':
        return new GarminConnector(config, debug);
      case 'trailhead':
        return new TrailheadConnector(config, debug);
      case 'velib':
        return new VelibConnector(config, debug);
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error('Unknown connector: ', JSON.stringify(config));
        throw new Error('Unknown connector');
    }
  }
}
