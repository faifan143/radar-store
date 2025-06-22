import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchStoreRewardRequests,
  updateUserRewardStatus,
  fetchStoreDashboardStats,
  bulkUpdateRewardStatus,
  createReward,
  fetchRewardDetails,
  searchRewards,
  fetchRewardsPaginated,
  getStoreCategories,
  getRewardStatusCounts,
  refreshStoreCache
} from '../services/rewardService';
import { UserReward, RewardStatus, UpdateUserRewardStatus } from '../types/reward';
import { useState } from 'react';

// ============================================================================
// CORE REWARD REQUESTS
// ============================================================================

/**
 * Fetch store reward requests with optional status filter
 */
export function useStoreRewardRequests(storeId: string, status?: RewardStatus) {
  return useQuery<UserReward[]>({
    queryKey: ['storeRewardRequests', storeId, status],
    queryFn: () => fetchStoreRewardRequests(storeId, status),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Update individual reward request status
 */
export function useUpdateUserRewardStatus() {
  const queryClient = useQueryClient();

  return useMutation<UserReward, Error, UpdateUserRewardStatus>({
    mutationFn: updateUserRewardStatus,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['storeRewardRequests'] });
      queryClient.invalidateQueries({ queryKey: ['storeDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['rewardDetails', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['rewardStatusCounts'] });
    },
    onError: (error) => {
      console.error('Failed to update reward status:', error);
    },
  });
}

/**
 * Bulk update multiple reward statuses
 */
export function useBulkUpdateRewardStatus() {
  const queryClient = useQueryClient();

  return useMutation<any[], Error, { ids: string[]; status: string; storeId: string }>({
    mutationFn: bulkUpdateRewardStatus,
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['storeRewardRequests', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeDashboardStats', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['rewardStatusCounts', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['searchRewards', variables.storeId] });
    },
    onError: (error) => {
      console.error('Failed to bulk update reward status:', error);
    },
  });
}

/**
 * Fetch detailed information for a specific reward
 */
export function useRewardDetails(rewardId: string) {
  return useQuery<any>({
    queryKey: ['rewardDetails', rewardId],
    queryFn: () => fetchRewardDetails(rewardId),
    enabled: !!rewardId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

/**
 * Fetch dashboard statistics for store
 */
export function useStoreDashboardStats(storeId: string) {
  return useQuery<{
    activeRewards: number;
    redemptionRate: number;
    monthlyRedemptions: number;
    totalRequests: number;
    approvedRequests: number;
    pendingRequests: number;
    rejectedRequests: number;
  }>({
    queryKey: ['storeDashboardStats', storeId],
    queryFn: () => fetchStoreDashboardStats(storeId),
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Fetch reward status counts
 */
export function useRewardStatusCounts(storeId: string) {
  return useQuery<{
    PENDING: number;
    FULFILLED: number;
    CANCELLED: number;
  }>({
    queryKey: ['rewardStatusCounts', storeId],
    queryFn: () => getRewardStatusCounts(storeId),
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================================================
// REWARD CREATION & MANAGEMENT
// ============================================================================

/**
 * Create a new reward
 */
export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, {
    title: string;
    description: string;
    pointsCost: number;
    category: string;
    storeId: string;
    isActive?: boolean;
    expiryDate?: string;
    maxRedemptions?: number;
  }>({
    mutationFn: createReward,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['storeDashboardStats', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeCategories', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['rewardsPaginated', variables.storeId] });
    },
    onError: (error) => {
      console.error('Failed to create reward:', error);
    },
  });
}

/**
 * Fetch store categories
 */
export function useStoreCategories(storeId: string) {
  return useQuery<any[]>({
    queryKey: ['storeCategories', storeId],
    queryFn: () => getStoreCategories(storeId),
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

/**
 * Search rewards with advanced filters
 */
export function useSearchRewards(
  storeId: string,
  searchParams: {
    query?: string;
    status?: RewardStatus;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'title' | 'status';
    sortOrder?: 'asc' | 'desc';
  },
  enabled: boolean = true
) {
  return useQuery<{
    data: UserReward[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>({
    queryKey: ['searchRewards', storeId, searchParams],
    queryFn: () => searchRewards(storeId, searchParams),
    enabled: !!storeId && enabled,
  });
}

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Fetch rewards with pagination
 */
export function useRewardsPaginated(
  storeId: string,
  searchParams: {
    categoryId?: string;
    isActive?: boolean;
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'title' | 'isActive';
    sortOrder?: 'asc' | 'desc';
  } = {},
  enabled: boolean = true
) {
  return useQuery<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>({
    queryKey: ['rewardsPaginated', storeId, searchParams],
    queryFn: () => fetchRewardsPaginated(storeId, searchParams),
    enabled: !!storeId && enabled,
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Refresh store cache
 */
export function useRefreshStoreCache() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: refreshStoreCache,
    onSuccess: (_, storeId) => {
      // Invalidate all store-related queries
      queryClient.invalidateQueries({ queryKey: ['storeRewardRequests', storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeDashboardStats', storeId] });
      queryClient.invalidateQueries({ queryKey: ['storeCategories', storeId] });
      queryClient.invalidateQueries({ queryKey: ['rewardStatusCounts', storeId] });
      queryClient.invalidateQueries({ queryKey: ['searchRewards', storeId] });
      queryClient.invalidateQueries({ queryKey: ['rewardsPaginated', storeId] });
    },
  });
}

/**
 * Optimistic update for reward status (for better UX)
 */
export function useOptimisticRewardUpdate() {
  const queryClient = useQueryClient();

  return useMutation<UserReward, Error, UpdateUserRewardStatus>({
    mutationFn: updateUserRewardStatus,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['storeRewardRequests'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['storeRewardRequests']);

      // Optimistically update
      queryClient.setQueryData(['storeRewardRequests'], (old: UserReward[] | undefined) => {
        if (!old) return old;
        return old.map(reward =>
          reward.id === variables.id
            ? { ...reward, status: variables.status }
            : reward
        );
      });

      return { previousData };
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['storeRewardRequests'] });
    },
  });
}

// ============================================================================
// COMPOSITE HOOKS (Multiple operations)
// ============================================================================

/**
 * Combined hook for reward management dashboard
 */
export function useRewardDashboard(storeId: string) {
  const dashboardStats = useStoreDashboardStats(storeId);
  const statusCounts = useRewardStatusCounts(storeId);
  const categories = useStoreCategories(storeId);

  return {
    stats: dashboardStats,
    statusCounts,
    categories,
    isLoading: dashboardStats.isLoading || statusCounts.isLoading || categories.isLoading,
    isError: dashboardStats.isError || statusCounts.isError || categories.isError,
    refetchAll: () => {
      dashboardStats.refetch();
      statusCounts.refetch();
      categories.refetch();
    },
  };
}

/**
 * Combined hook for reward list with search
 */
export function useRewardListWithSearch(
  storeId: string,
  initialSearchParams: any = {}
) {
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  const searchResults = useSearchRewards(storeId, searchParams);
  const paginatedResults = useRewardsPaginated(storeId, searchParams);

  return {
    searchResults,
    paginatedResults,
    searchParams,
    setSearchParams,
    isLoading: searchResults.isLoading || paginatedResults.isLoading,
    isError: searchResults.isError || paginatedResults.isError,
  };
}