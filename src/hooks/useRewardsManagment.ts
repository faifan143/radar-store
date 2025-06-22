import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BulkDeleteRewardsDto, BulkUpdateRewardsDto, CreateRewardDto, GetStoreRewardsQueryDto, Reward, RewardFilters, RewardsPaginatedResponse, UpdateRewardDto } from '@/types/reward-managment';
import { getStoreRewards, getStoreReward, getRewardAnalytics, createStoreReward, handleRewardManagementError, updateStoreReward, deleteStoreReward, toggleStoreRewardStatus, bulkUpdateStoreRewards, bulkDeleteStoreRewards, exportStoreRewards } from '@/services/rewards-managment.service';


// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch store rewards with pagination and filters
 */
export function useStoreRewards(
    storeId: string,
    query: GetStoreRewardsQueryDto = {},
    enabled: boolean = true
) {
    return useQuery<RewardsPaginatedResponse, Error>({
        queryKey: ['storeRewards', storeId, query],
        queryFn: () => getStoreRewards(storeId, query),
        enabled: !!storeId && enabled,

    });
}

/**
 * Get single store reward
 */
export function useStoreReward(rewardId: string, storeId: string) {
    return useQuery<Reward, Error>({
        queryKey: ['storeReward', rewardId, storeId],
        queryFn: () => getStoreReward(rewardId, storeId),
        enabled: !!rewardId && !!storeId,

    });
}

/**
 * Get reward analytics
 */
export function useRewardAnalytics(
    rewardId: string,
    storeId: string,
    timeRange?: '7d' | '30d' | '90d' | '1y'
) {
    return useQuery({
        queryKey: ['rewardAnalytics', rewardId, storeId, timeRange],
        queryFn: () => getRewardAnalytics(rewardId, storeId, timeRange),
        enabled: !!rewardId && !!storeId,

    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create new reward
 */
export function useCreateStoreReward() {
    const queryClient = useQueryClient();

    return useMutation<Reward, Error, CreateRewardDto>({
        mutationFn: createStoreReward,
        onSuccess: (data) => {
            // Invalidate and refetch store rewards
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', data.storeId]
            });

            // Add the new reward to cache
            queryClient.setQueryData(
                ['storeReward', data.id, data.storeId],
                data
            );
        },
        onError: (error) => {
            console.error('Failed to create reward:', handleRewardManagementError(error));
        },
    });
}

/**
 * Update store reward
 */
export function useUpdateStoreReward() {
    const queryClient = useQueryClient();

    return useMutation<Reward, Error, {
        id: string;
        storeId: string;
        data: UpdateRewardDto;
    }>({
        mutationFn: ({ id, storeId, data }) => updateStoreReward(id, storeId, data),
        onSuccess: (data, variables) => {
            // Update specific reward cache
            queryClient.setQueryData(
                ['storeReward', variables.id, variables.storeId],
                data
            );

            // Invalidate rewards list
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', variables.storeId]
            });
        },
        onError: (error) => {
            console.error('Failed to update reward:', handleRewardManagementError(error));
        },
    });
}

/**
 * Delete store reward
 */
export function useDeleteStoreReward() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { id: string; storeId: string }>({
        mutationFn: ({ id, storeId }) => deleteStoreReward(id, storeId),
        onSuccess: (_, variables) => {
            // Remove from cache
            queryClient.removeQueries({
                queryKey: ['storeReward', variables.id, variables.storeId]
            });

            // Invalidate rewards list
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', variables.storeId]
            });
        },
        onError: (error) => {
            console.error('Failed to delete reward:', handleRewardManagementError(error));
        },
    });
}

/**
 * Toggle reward status
 */
export function useToggleStoreRewardStatus() {
    const queryClient = useQueryClient();

    return useMutation<Reward, Error, {
        id: string;
        storeId: string;
        isActive: boolean;
    }>({
        mutationFn: ({ id, storeId, isActive }) =>
            toggleStoreRewardStatus(id, storeId, { isActive }),
        onSuccess: (data, variables) => {
            // Update specific reward cache
            queryClient.setQueryData(
                ['storeReward', variables.id, variables.storeId],
                data
            );

            // Invalidate rewards list
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', variables.storeId]
            });
        },
        onError: (error) => {
            console.error('Failed to toggle reward status:', handleRewardManagementError(error));
        },
    });
}

/**
 * Bulk update rewards
 */
export function useBulkUpdateStoreRewards() {
    const queryClient = useQueryClient();

    return useMutation<Reward[], Error, {
        storeId: string;
        data: BulkUpdateRewardsDto;
    }>({
        mutationFn: ({ storeId, data }) => bulkUpdateStoreRewards(storeId, data),
        onSuccess: (data, variables) => {
            // Invalidate all store rewards
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', variables.storeId]
            });

            // Update individual reward caches
            data.forEach(reward => {
                queryClient.setQueryData(
                    ['storeReward', reward.id, variables.storeId],
                    reward
                );
            });
        },
        onError: (error) => {
            console.error('Failed to bulk update rewards:', handleRewardManagementError(error));
        },
    });
}

/**
 * Bulk delete rewards
 */
export function useBulkDeleteStoreRewards() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, {
        storeId: string;
        data: BulkDeleteRewardsDto;
    }>({
        mutationFn: ({ storeId, data }) => bulkDeleteStoreRewards(storeId, data),
        onSuccess: (_, variables) => {
            // Remove from cache
            variables.data.ids.forEach(id => {
                queryClient.removeQueries({
                    queryKey: ['storeReward', id, variables.storeId]
                });
            });

            // Invalidate rewards list
            queryClient.invalidateQueries({
                queryKey: ['storeRewards', variables.storeId]
            });
        },
        onError: (error) => {
            console.error('Failed to bulk delete rewards:', handleRewardManagementError(error));
        },
    });
}

/**
 * Export rewards
 */
export function useExportStoreRewards() {
    return useMutation<Blob, Error, {
        storeId: string;
        format?: 'csv' | 'xlsx' | 'json';
        filters?: GetStoreRewardsQueryDto;
    }>({
        mutationFn: ({ storeId, format, filters }) =>
            exportStoreRewards(storeId, format, filters),
        onError: (error) => {
            console.error('Failed to export rewards:', handleRewardManagementError(error));
        },
    });
}

// ============================================================================
// COMBINED HOOKS
// ============================================================================

/**
 * Hook for managing reward filters and search
 */
export function useRewardFilters(initialFilters: RewardFilters = {}) {
    const [filters, setFilters] = useState<RewardFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...initialFilters
    });

    const updateFilter = (key: keyof RewardFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            // Reset to page 1 when changing filters (except when changing page itself)
            ...(key !== 'page' && { page: 1 })
        }));
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            ...initialFilters
        });
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    return {
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        clearFilters,
    };
}

/**
 * Combined hook for reward management with filters
 */
export function useRewardManagement(storeId: string, initialFilters: RewardFilters = {}) {
    const { filters, updateFilter, resetFilters, clearFilters } = useRewardFilters(initialFilters);

    const rewards = useStoreRewards(storeId, filters);
    const createReward = useCreateStoreReward();
    const updateReward = useUpdateStoreReward();
    const deleteReward = useDeleteStoreReward();
    const toggleStatus = useToggleStoreRewardStatus();
    const bulkUpdate = useBulkUpdateStoreRewards();
    const bulkDelete = useBulkDeleteStoreRewards();

    return {
        // Data
        rewards: rewards.data?.data || [],
        pagination: rewards.data?.pagination,
        isLoading: rewards.isLoading,
        isError: rewards.isError,
        error: rewards.error,

        // Filters
        filters,
        updateFilter,
        resetFilters,
        clearFilters,

        // Actions
        createReward,
        updateReward,
        deleteReward,
        toggleStatus,
        bulkUpdate,
        bulkDelete,

        // Utilities
        refetch: rewards.refetch,
    };
}