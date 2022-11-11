import { BadgeReport, Connector } from '@badger/common';
import { AllConfigurationsType } from './aggregation-types';
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
    return {
      name: connector.name,
      website: connector.website,
      badges,
    };
  }

  private getConnector(config: AllConfigurationsType): Connector {
    switch (config.name) {
      case 'codingame':
        return new CodingameConnector(config);
    }
  }
}
