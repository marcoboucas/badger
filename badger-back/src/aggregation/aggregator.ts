import { BadgeReport, Connector } from '@badger/common';
import { AllConfigurationsType } from './aggregation-types';
import { GarminConnector, TrailheadConnector } from './connectors';
import { CodingameConnector } from './connectors/codingame/connector';

export class Aggregator {
  constructor(private readonly configurations: AllConfigurationsType[]) {}

  public async getBadges(): Promise<BadgeReport[]> {
    return (
      await Promise.all(
        this.configurations.map(async (config) => {
          try {
            return await this.getBadgeReportFromConfig(config);
          } catch (e) {
            console.error(e);
            return null;
          }
        }),
      )
    ).filter((x): x is BadgeReport => x !== null);
  }

  private async getBadgeReportFromConfig(
    config: AllConfigurationsType,
  ): Promise<BadgeReport> {
    const connector = this.getConnector(config);
    const badges = await connector.getBadges();

    // Points
    const pointsAcquired = badges
      .filter((badge) => badge.acquired)
      .reduce((acc, badge) => acc + (badge.weight ?? 0), 0);
    const pointsTotal = badges.reduce(
      (acc, badge) => acc + (badge.weight ?? 0),
      0,
    );
    const pointsPercentage = Math.floor((pointsAcquired / pointsTotal) * 100);

    // Badges
    const badgesAcquired = badges.filter((badge) => badge.acquired).length;
    const badgesTotal = badges.length;
    const badgesPercentage = Math.floor((badgesAcquired / badgesTotal) * 100);
    return {
      name: connector.name,
      website: connector.website,
      badges,
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
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error('Unknown connector: ', JSON.stringify(config));
        throw new Error('Unknown connector');
    }
  }
}
