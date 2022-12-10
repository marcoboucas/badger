export interface RawCodingameBadge {
  id: string;
  title: string;
  description: string;
  imageBinaryId: string;
  completionTime: number;
  progress: number;
  weight: number;
}

export interface CodingameStats {
  codingamerPoints: number;
  achievementCount: number;
  codingamer: {
    userId: number;
    pseudo: string;
    countryId: string;
    publicHandle: string;
    formValues: {
      city: string;
      school: string;
    };
    enable: boolean;
    schoolId: number;
    rank: number;
    avatar: number;
    onlineSince: number;
    company: string;
    city: string;
    level: number;
    xp: number;
    category: string;
  };
  codingamePointsRankingDto: {
    rankHistorics: {
      ranks: number[];
      totals: number[];
      points: number[];
      contestPoints: number[];
      optimPoints: number[];
      codegolfPoints: number[];
      multiTrainingPoints: number[];
      clashPoints: number[];
      dates: number[];
    };
    codingamePointsTotal: number;
    codingamePointsRank: number;
    codingamePointsContests: number;
    codingamePointsAchievements: number;
    codingamePointsXp: number;
    codingamePointsOptim: number;
    codingamePointsCodegolf: number;
    codingamePointsMultiTraining: number;
    codingamePointsClash: number;
    numberCodingamers: number;
    numberCodingamersGlobal: number;
  };
  xpThresholds: Array<{
    level: number;
    xpThreshold: number;
    cumulativeXp: number;
    rewardLanguages?: {
      1: string;
      2: string;
    };
  }>;
}
