import { BulkDeleteRewardsDto, BulkUpdateRewardsDto, CreateRewardDto, GetStoreRewardsQueryDto, Reward, RewardAnalytics, RewardsPaginatedResponse, ToggleRewardStatusDto, UpdateRewardDto } from "@/types/reward-managment";
import apiClient from "@/utils/apiClient";

// ============================================================================
// STORE REWARDS MANAGEMENT SERVICE
// ============================================================================


/**
 * Fetch store's created rewards with pagination and filters
 */
export const getStoreRewards = async (
    storeId: string,
    query: GetStoreRewardsQueryDto = {}
): Promise<RewardsPaginatedResponse> => {
    const params = {
        storeId,
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
        ...query
    };

    const { data } = await apiClient.get('/rewards/admin/rewards', { params });
    return data;
};

/**
 * Get single store reward by ID
 */
export const getStoreReward = async (
    id: string,
    storeId: string
): Promise<Reward> => {
    const { data } = await apiClient.get(`/rewards/admin/rewards/${id}`, {
        params: { storeId }
    });
    return data;
};

/**
 * Update store reward
 */
export const updateStoreReward = async (
    id: string,
    storeId: string,
    dto: UpdateRewardDto
): Promise<Reward> => {
    const { data } = await apiClient.put(`/rewards/admin/rewards/${id}`, dto, {
        params: { storeId }
    });
    return data;
};

/**
 * Delete store reward
 */
export const deleteStoreReward = async (
    id: string,
    storeId: string
): Promise<void> => {
    await apiClient.delete(`/rewards/admin/rewards/${id}`, {
        params: { storeId }
    });
};

/**
 * Toggle store reward status (active/inactive)
 */
export const toggleStoreRewardStatus = async (
    id: string,
    storeId: string,
    dto: ToggleRewardStatusDto
): Promise<Reward> => {
    const { data } = await apiClient.patch(`/rewards/admin/rewards/${id}/status`, dto, {
        params: { storeId }
    });
    return data;
};

/**
 * Bulk update store rewards
 */
export const bulkUpdateStoreRewards = async (
    storeId: string,
    dto: BulkUpdateRewardsDto
): Promise<Reward[]> => {
    const { data } = await apiClient.put('/rewards/admin/rewards/bulk-update', dto, {
        params: { storeId }
    });
    return data;
};

/**
 * Bulk delete store rewards
 */
export const bulkDeleteStoreRewards = async (
    storeId: string,
    dto: BulkDeleteRewardsDto
): Promise<void> => {
    await apiClient.delete('/rewards/admin/rewards/bulk-delete', {
        params: { storeId },
        data: dto
    });
};

/**
 * Create new reward
 */
export const createStoreReward = async (dto: CreateRewardDto): Promise<Reward> => {
    const { data } = await apiClient.post('/rewards/admin/rewards', dto);
    return data;
};

/**
 * Get reward analytics (if you add this endpoint later)
 */
export const getRewardAnalytics = async (
    id: string,
    storeId: string,
    timeRange?: '7d' | '30d' | '90d' | '1y'
): Promise<RewardAnalytics> => {
    const { data } = await apiClient.get(`/rewards/admin/rewards/${id}/analytics`, {
        params: { storeId, timeRange }
    });
    return data;
};

/**
 * Export rewards data (if you add this endpoint later)
 */
export const exportStoreRewards = async (
    storeId: string,
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    filters?: GetStoreRewardsQueryDto
): Promise<Blob> => {
    const response = await apiClient.get('/rewards/admin/rewards/export', {
        params: { storeId, format, ...filters },
        responseType: 'blob'
    });
    return response.data;
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export const handleRewardManagementError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    switch (error.response?.status) {
        case 400:
            return 'Invalid reward data provided';
        case 401:
            return 'You are not authorized to perform this action';
        case 403:
            return 'You do not have permission to manage rewards';
        case 404:
            return 'Reward not found';
        case 409:
            return 'Reward with this name already exists';
        case 422:
            return 'Reward data validation failed';
        default:
            return 'An unexpected error occurred while managing rewards';
    }
};

// ============================================================================
// SERVICE OBJECT
// ============================================================================

export const RewardManagementService = {
    // Core operations
    getRewards: getStoreRewards,
    getReward: getStoreReward,
    updateReward: updateStoreReward,
    deleteReward: deleteStoreReward,
    createReward: createStoreReward,

    // Status management
    toggleStatus: toggleStoreRewardStatus,

    // Bulk operations
    bulkUpdate: bulkUpdateStoreRewards,
    bulkDelete: bulkDeleteStoreRewards,

    // Analytics & Export
    getAnalytics: getRewardAnalytics,
    exportRewards: exportStoreRewards,

    // Utilities
    handleError: handleRewardManagementError
};