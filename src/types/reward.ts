/**
 * Reward and Reward Request Types
 * @module types/reward
 */
export type RewardStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED';

export interface RewardCategory {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  storeId?: string;
  isRadar: boolean;
  category: RewardCategory;
}

export interface UserReward {
  id: string,
  userId: string,
  rewardId: string,
  pointsSpent: number,
  status: RewardStatus,
  createdAt: string,
  user: {
    id: string,
    name: string,
    phone: string
  },
  reward: Reward
}



export interface UpdateUserRewardStatus {
  id: string;
  status: RewardStatus;
}













