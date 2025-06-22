import apiClient from '../utils/apiClient';
import { UserReward, RewardStatus, UpdateUserRewardStatus } from '../types/reward';

// ============================================================================
// CORE REWARD REQUESTS MANAGEMENT
// ============================================================================

/**
 * Fetch store reward requests with optional status filter
 */
export const fetchStoreRewardRequests = async (
  storeId: string,
  status?: RewardStatus
): Promise<UserReward[]> => {
  const params: any = { storeId };
  if (status) params.status = status;

  const { data } = await apiClient.get('/rewards/admin/purchases', { params });
  return data;
};

/**
 * Update individual reward request status
 */
export const updateUserRewardStatus = async (
  payload: UpdateUserRewardStatus
): Promise<UserReward> => {
  const { data } = await apiClient.put(
    `/rewards/admin/purchases/${payload.id}/status`,
    { status: payload.status }
  );
  return data;
};

/**
 * Bulk update multiple reward requests status
 */
export const bulkUpdateRewardStatus = async (payload: {
  ids: string[];
  status: string; // Backend accepts string, not RewardStatus enum
  storeId: string;
}): Promise<any[]> => {
  const { data } = await apiClient.put('/rewards/admin/purchases/bulk-update', payload);
  return data;
  /* Expected response: Array of updated UserReward objects */
};

/**
 * Fetch detailed information for a specific reward request (UserReward)
 */
export const fetchRewardDetails = async (id: string): Promise<any> => {
  const { data } = await apiClient.get(`/rewards/admin/purchases/${id}`);
  return data;
  /* Expected response: UserReward with nested reward, user data
  {
    id: string,
    status: string,
    createdAt: string,
    reward: {
      id: string,
      title: string,
      description: string,
      pointsCost: number,
      category: { id: string, name: string },
      store: { id: string, name: string }
    },
    user: {
      id: string,
      name: string,
      email: string
    }
  }
  */
};

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

/**
 * Fetch dashboard statistics for store overview
 */
export const fetchStoreDashboardStats = async (storeId: string) => {
  const { data } = await apiClient.get(`/rewards/admin/stores/${storeId}/dashboard-stats`);
  return data;
  /* Expected response structure:
  {
    activeRewards: number,
    redemptionRate: number,
    monthlyRedemptions: number,
    totalRequests: number,
    approvedRequests: number,
    pendingRequests: number,
    rejectedRequests: number
  }
  */
};

// ============================================================================
// REWARD CREATION & MANAGEMENT
// ============================================================================

/**
 * Create a new reward for the store
 */
export const createReward = async (payload: {
  title: string;
  description: string;
  pointsCost: number;
  category: string; // This should be categoryId in the actual request
  storeId: string;
  isActive?: boolean;
  expiryDate?: string;
  maxRedemptions?: number;
}): Promise<any> => {
  // Transform category to categoryId to match backend DTO
  const requestPayload = {
    ...payload,
    category: payload.category, // Backend expects 'category' but uses it as categoryId
  };

  const { data } = await apiClient.post('/rewards/admin/rewards', requestPayload);
  return data;
};

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

/**
 * Search and filter rewards with advanced options
 */
export const searchRewards = async (
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
  }
): Promise<{
  data: UserReward[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  const params = { storeId, ...searchParams };
  const { data } = await apiClient.get('/rewards/admin/purchases/search', { params });
  return data;
};

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Fetch rewards with pagination support
 */
export const fetchRewardsPaginated = async (
  storeId: string,
  searchParams: {
    categoryId?: string;
    isActive?: boolean;
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'title' | 'isActive';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{
  data: any[]; // Reward objects with category and store included
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> => {
  const params = {
    storeId,
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...searchParams
  };

  const { data } = await apiClient.get('/rewards/admin/purchases/paginated', { params });
  return data;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get reward categories for the store
 */
export const getStoreCategories = async (): Promise<any[]> => {
  const { data } = await apiClient.get(`/rewards/categories`);
  return data;
  /* Expected response: Array of categories with reward count
  [
    {
      id: string,
      name: string,
      description?: string,
      _count: {
        rewards: number
      }
    }
  ]
  */
};

/**
 * Get reward status counts for the store (if you want to add this endpoint)
 */
export const getRewardStatusCounts = async (storeId: string) => {
  // This endpoint doesn't exist in your backend yet, but could be useful
  const { data } = await apiClient.get(`/rewards/admin/stores/${storeId}/status-counts`);
  return data;
  /* Expected response:
  {
    PENDING: number,
    FULFILLED: number,
    CANCELLED: number
  }
  */
};

/**
 * Refresh store cache (useful after bulk operations)
 */
export const refreshStoreCache = async (storeId: string): Promise<void> => {
  await apiClient.post(`/rewards/admin/stores/${storeId}/refresh-cache`);
};

// ============================================================================
// ERROR HANDLING WRAPPER
// ============================================================================

/**
 * Generic error handler for all reward service functions
 */
export const handleRewardServiceError = (error: any, operation: string) => {
  console.error(`Reward Service Error [${operation}]:`, error);

  if (error.response) {
    // Server responded with error status
    throw new Error(error.response.data?.message || `Failed to ${operation}`);
  } else if (error.request) {
    // Request made but no response
    throw new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(`An unexpected error occurred during ${operation}`);
  }
};

// ============================================================================
// EXPORTED SERVICE OBJECT (Alternative usage pattern)
// ============================================================================

export const RewardService = {
  // Core operations
  fetchRequests: fetchStoreRewardRequests,
  updateStatus: updateUserRewardStatus,
  bulkUpdate: bulkUpdateRewardStatus,
  getDetails: fetchRewardDetails,

  // Dashboard
  getStats: fetchStoreDashboardStats,
  getStatusCounts: getRewardStatusCounts,

  // Management
  create: createReward,
  getCategories: getStoreCategories,

  // Search & Pagination
  search: searchRewards,
  paginated: fetchRewardsPaginated,

  // Utilities
  refreshCache: refreshStoreCache,
  handleError: handleRewardServiceError
};

export default RewardService;