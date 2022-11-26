import { Badge, Connector, Metric } from '@badger/common';
import { GarminConnect } from 'garmin-connect';
import { GarminConfig } from './config';

interface RawGarminBadge {
  badgeId: string;
  badgeKey: string;
  badgeName: string;
  badgePoints: number;
  badgeUuid: string | null;
  badgeEarnedDate: string | null;
  badgeProgressValue: number | null;
}
export class GarminConnector implements Connector {
  config: GarminConfig;
  name = 'Garmin';
  website = 'https://connect.garmin.com/';

  constructor(config: GarminConfig) {
    this.config = config;
  }

  private async getBadges(): Promise<Badge[]> {
    const client = new GarminConnect();
    await client.login(this.config.login, this.config.password);

    // Get access token
    const accessToken = await this.getAccessToken(client);

    // Get translations
    const descriptions = await this.getDescriptionsFromGarmin(
      client,
      accessToken,
    );

    // get the badges
    const rawAcquiredBadges = await this.getEarnedBadgesFromGarmin(
      client,
      accessToken,
    );
    const rawAvailableBadges = await this.getAvailableBadgesFromGarmin(
      client,
      accessToken,
    );

    const rawBadges = [...rawAcquiredBadges, ...rawAvailableBadges];
    return rawBadges
      .map((rawBadge: RawGarminBadge): Badge | null => {
        const name = descriptions.get('badge_title_' + rawBadge.badgeKey);
        const description = descriptions.get(
          'badge_description_' + rawBadge.badgeKey,
        );
        if (name === undefined || description === undefined) {
          console.log('Missing description for badge ' + rawBadge.badgeKey);
          return null;
        }
        const baseBadge = {
          id: rawBadge.badgeKey,
          name,
          description,
          image: `https://connect.garmin.com/web-images/badges/xxhdpi/badge_${
            rawBadge.badgeUuid ?? rawBadge.badgeId
          }_sml.png?bust=4.61.0.18`,
          isSquare: true,
          weight: rawBadge.badgePoints,
        };
        if (rawBadge.badgeEarnedDate != null) {
          return {
            ...baseBadge,
            source: 'garmin',
            acquired: true,
            acquisitionDate: new Date(rawBadge.badgeEarnedDate),
          };
        }
        // else
        return {
          ...baseBadge,
          source: 'garmin',
          acquired: false,
        };
      })
      .filter((badge: Badge | null): badge is Badge => badge !== null);
  }

  private async getMetrics(): Promise<Metric[]> {
    return [];
  }

  public async getData(): Promise<{ badges: Badge[]; metrics: Metric[] }> {
    return {
      badges: await this.getBadges(),
      metrics: await this.getMetrics(),
    };
  }

  private async getAccessToken(client: any): Promise<string> {
    const previousHeaders = client.client.headers;
    client.client.headers = {
      ...client.client.headers,
      origin: 'https://connect.garmin.com',
      referer: 'https://connect.garmin.com/modern/',
    };
    const tokenValues = await client.post(
      'https://connect.garmin.com/modern/di-oauth/exchange',
    );
    client.client.headers = previousHeaders;
    return tokenValues.access_token;
  }

  private async getEarnedBadgesFromGarmin(
    client: any,
    accessToken: string,
  ): Promise<RawGarminBadge[]> {
    const previousHeaders = client.client.headers;
    client.client.headers = {
      ...client.client.headers,
      'di-backend': 'connectapi.garmin.com',
      authorization: `Bearer ${accessToken}`,
    };
    const timestamp = new Date().getTime().toString();
    const badges = await client.get(
      'https://connect.garmin.com/badge-service/badge/earned?_=' + timestamp,
    );
    client.client.headers = previousHeaders;
    return badges;
  }

  private async getAvailableBadgesFromGarmin(
    client: any,
    accessToken: string,
  ): Promise<RawGarminBadge[]> {
    const previousHeaders = client.client.headers;
    client.client.headers = {
      ...client.client.headers,
      'di-backend': 'connectapi.garmin.com',
      authorization: `Bearer ${accessToken}`,
    };
    const timestamp = new Date().getTime().toString();
    const badges = await client.get(
      'https://connect.garmin.com/badge-service/badge/available?_=' + timestamp,
    );
    client.client.headers = previousHeaders;
    return badges;
  }

  private async getDescriptionsFromGarmin(
    client: any,
    accessToken: string,
  ): Promise<Map<string, string>> {
    const descriptionsRaw = await client.client.get(
      'https://connect.garmin.com/web-translations/badges-list/badges-list_fr.properties?bust=4.61.0.18',
    );
    const mapping = new Map<string, string>();
    const lines = descriptionsRaw.split('\n');
    lines.forEach((line: string) => {
      const parts = line.split('=');
      if (parts.length === 2) {
        mapping.set(parts[0], parts[1]);
      }
    });
    return mapping;
  }
}
