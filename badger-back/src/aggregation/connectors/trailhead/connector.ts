import { Badge, Connector } from '@badger/common';
import { TrailheadConfig } from './config';

import { AxiosInstance } from 'axios';
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
  config: TrailheadConfig;
  name = 'Trailhead';
  website = 'https://trailhead.salesforce.com/';

  private readonly url = 'https://profile.api.trailhead.com/graphql';

  constructor(config: TrailheadConfig) {
    this.config = config;
  }

  public async getBadges(): Promise<Badge[]> {
    const response = await this.getAxiosInstance().post(
      this.url,
      this.buildQuery(this.config.userId, 100),
    );
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

  private buildQuery(userId: string, count: number = 100): any {
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

  private getAxiosInstance(): AxiosInstance {
    return axiosInstance;
  }
}
