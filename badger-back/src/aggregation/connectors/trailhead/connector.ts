import { Badge, Connector, Metric } from '@badger/common';
import { TrailheadConfig } from './config';

import { AxiosInstance } from 'axios';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { TMP_FOLDER } from '../../../config';
import { axiosInstance } from '../axios-instance';

interface RawTrailheadBadge {
  __typename: string;
  id: string;
  award: {
    __typename: string;
    id: string;
    title: string;
    type: string;
    icon: string;
    content: {
      __typename: string;
      webUrl: string;
      description: string;
    } | null;
  };
}

export class TrailheadConnector implements Connector {
  debug = true;
  config: TrailheadConfig;
  name = 'Trailhead';
  website = 'https://trailhead.salesforce.com/';

  private readonly url = 'https://profile.api.trailhead.com/graphql';

  constructor(config: TrailheadConfig, debug: boolean = false) {
    this.config = config;
    this.debug = debug;
  }

  private async getBadges(): Promise<Badge[]> {
    const response = await this.getAxiosInstance().post(
      this.url,
      this.buildBadgesQuery(this.config.userId, 100),
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch badges from Trailhead. Status: ${response.status}`,
      );
    }

    if (this.debug) {
      writeFileSync(
        join(TMP_FOLDER, 'trailhead-badges.json'),
        JSON.stringify(response.data, null, 2),
      );
    }
    return response.data.data.profile.earnedAwards.edges.map(
      (edge: { node: RawTrailheadBadge }): Badge => {
        return {
          source: 'trailhead',
          id: edge.node.id,
          name: edge.node.award.title,
          description: edge.node.award.content?.description ?? '',
          image: edge.node.award.icon,
          isSquare: true,
          weight: 1,
          acquired: true,
          acquisitionDate: null,
        };
      },
    );
  }

  private async getMetrics(): Promise<Metric[]> {
    const response = await this.getAxiosInstance().post(
      this.url,
      this.buildPointsQuery(this.config.userId),
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch metrics from Trailhead. Status: ${response.status}`,
      );
    }

    if (this.debug) {
      writeFileSync(
        join(TMP_FOLDER, 'trailhead-points.json'),
        JSON.stringify(response.data, null, 2),
      );
    }

    return [
      {
        source: 'trailhead',
        id: 'trailhead-completed-badges',
        name: 'Completed Badges',
        description: 'Number of badges completed on Trailhead',
        value: response.data.data.profile.trailheadStats.earnedBadgesCount,
        updateDate: new Date(),
      },
      {
        source: 'trailhead',
        id: 'trailhead-completed-trails',
        name: 'Completed Trails',
        description: 'Number of trails completed on Trailhead',
        value: response.data.data.profile.trailheadStats.completedTrailCount,
        updateDate: new Date(),
      },
      {
        source: 'trailhead',
        id: 'trailhead-points',
        name: 'Points',
        description: 'Number of points earned on Trailhead',
        value: response.data.data.profile.trailheadStats.earnedPointsSum,
        updateDate: new Date(),
      },
    ];
  }

  public async getData(): Promise<{ badges: Badge[]; metrics: Metric[] }> {
    return {
      badges: await this.getBadges(),
      metrics: await this.getMetrics(),
    };
  }

  private buildBadgesQuery(userId: string, count: number = 100): any {
    const query = {
      operationName: 'GetTrailheadBadges',
      variables: {
        queryProfile: true,
        count,
        after: null,
        filter: null,
        trailblazerId: userId,
      },
      query: `fragment EarnedAward on EarnedAwardBase {\n  __typename\n  id\n  award {\n    __typename\n    id\n    title\n    type\n    icon\n    content {\n      __typename\n      webUrl\n      description\n    }\n  }\n}\n\nfragment EarnedAwardSelf on EarnedAwardSelf {\n  __typename\n  id\n  award {\n    __typename\n    id\n    title\n    type\n    icon\n    content {\n      __typename\n      webUrl\n      description\n    }\n  }\n  earnedAt\n  earnedPointsSum\n}\n\nfragment StatsBadgeCount on TrailheadProfileStats {\n  __typename\n  earnedBadgesCount\n  superbadgeCount\n}\n\nfragment ProfileBadges on PublicProfile {\n  __typename\n  trailheadStats {\n    ... on TrailheadProfileStats {\n      ...StatsBadgeCount\n    }\n  }\n  earnedAwards(first: $count, after: $after, awardType: $filter) {\n    edges {\n      node {\n        ... on EarnedAwardBase {\n          ...EarnedAward\n        }\n        ... on EarnedAwardSelf {\n          ...EarnedAwardSelf\n        }\n      }\n    }\n    pageInfo {\n      ...PageInfoBidirectional\n    }\n  }\n}\n\nfragment PageInfoBidirectional on PageInfo {\n  __typename\n  endCursor\n  hasNextPage\n  startCursor\n  hasPreviousPage\n}\n\nquery GetTrailheadBadges($trailblazerId: String, $queryProfile: Boolean = false, $count: Int = ${count}, $after: String = null, $filter: AwardTypeFilter = null) {\n  profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {\n    __typename\n    ... on PublicProfile {\n      ...ProfileBadges\n    }\n  }\n}\n`,
    };
    return query;
  }

  private buildPointsQuery(userId: string): any {
    const query = {
      operationName: 'GetTrailheadRank',
      variables: {
        queryProfile: true,
        trailblazerId: userId,
      },
      query:
        'fragment TrailheadRank on TrailheadRank {\n  __typename\n  title\n  requiredPointsSum\n  requiredBadgesCount\n  imageUrl\n}\n\nfragment PublicProfile on PublicProfile {\n  __typename\n  trailheadStats {\n    __typename\n    earnedPointsSum\n    earnedBadgesCount\n    completedTrailCount\n    rank {\n      ...TrailheadRank\n    }\n    nextRank {\n      ...TrailheadRank\n    }\n  }\n}\n\nquery GetTrailheadRank($trailblazerId: String, $queryProfile: Boolean!) {\n  profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {\n    ... on PublicProfile {\n      ...PublicProfile\n    }\n    ... on PrivateProfile {\n      __typename\n    }\n  }\n}\n',
    };
    return query;
  }

  private getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }
}
