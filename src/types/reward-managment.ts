// ============================================================================
// REWARD MANAGEMENT TYPES
// ============================================================================

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  categoryId?: string;
  category?: RewardCategory;
  isActive: boolean;
  expiryDate?: string;
  currentRedemptions: number;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardCategory {
  id: string;
  name: string;
  description?: string;
  storeId: string;
}

export interface GetStoreRewardsQueryDto {
  categoryId?: string;
  isActive?: boolean;
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateRewardDto {
  title?: string;
  description?: string;
  pointsCost?: number;
  categoryId?: string;
  isActive?: boolean;
  expiryDate?: string;
}

export interface ToggleRewardStatusDto {
  isActive: boolean;
}

export interface BulkUpdateRewardsDto {
  ids: string[];
  data: UpdateRewardDto;
}

export interface BulkDeleteRewardsDto {
  ids: string[];
}

export interface CreateRewardDto {
  title: string;
  description: string;
  pointsCost: number;
  categoryId?: string;
  isActive?: boolean;
  expiryDate?: string;
  storeId: string;
}

export interface RewardsPaginatedResponse {
  data: Reward[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface RewardFilters {
  categoryId?: string;
  isActive?: boolean;
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'pointsCost' | 'isActive' | 'currentRedemptions';
  sortOrder?: 'asc' | 'desc';
}

export interface RewardAnalytics {
  totalRedemptions: number;
  uniqueUsers: number;
  totalPointsSpent: number;
  redemptionTrend: Array<{ date: string; count: number }>;
  topUsers: Array<{ userId: string; userName: string; redemptionCount: number }>;
  conversionRate: number;
  avgRedemptionTime: number;
}