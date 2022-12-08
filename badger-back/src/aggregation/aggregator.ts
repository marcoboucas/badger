import { DataReport, Connector } from '@badger/common';
import { AllConfigurationsType } from './aggregation-types';
import {
  GarminConnector,
  KaggleConnector,
  TrailheadConnector,
  VelibConnector,
} from './connectors';
import { CodingameConnector } from './connectors/codingame/connector';

export class Aggregator {
  constructor(private readonly configurations: AllConfigurationsType[]) {}

  public async getData(): Promise<DataReport[]> {
    return (
      await Promise.all(
        this.configurations.map(async (config) => {
          try {
            return await this.getDataReportFromConfig(config);
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
  ): Promise<DataReport> {
    const connector = this.getConnector(config);
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

  private getConnector(config: AllConfigurationsType): Connector {
    switch (config.name) {
      case 'codingame':
        return new CodingameConnector(config);
      case 'garmin':
        return new GarminConnector(config);
      case 'trailhead':
        return new TrailheadConnector(config);
      case 'velib':
        return new VelibConnector(config);
      case 'kaggle':
        return new KaggleConnector(config);
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error('Unknown connector: ', JSON.stringify(config));
        throw new Error('Unknown connector');
    }
  }
}
