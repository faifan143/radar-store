"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import RewardsList from "@/components/RewardsList";
import { Gift, Sparkles, TrendingUp, Plus, RefreshCw, CheckCircle, Clock, Trophy, Search, Filter } from "lucide-react";
import { useStoreDashboardStats, useRefreshStoreCache, useStoreRewardRequests } from "@/hooks/useStoreRewardRequests";
import { toast } from "react-hot-toast";
import CreateRewardModal from "@/components/CreateRewardModal";
import RewardsManagementPage from "../rewards-managment/page";
import RewardFilters from "@/components/RewardFilters";
import { useTranslation } from 'react-i18next';

interface FilterState {
  query?: string;
  isActive?: boolean;
  categoryId?: string;
  status?: 'PENDING' | 'FULFILLED' | 'CANCELLED';
}

export default function RewardsTabsPage() {
  const { isAuthenticated, store, isLoading } = useAuthStore();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'management'>('rewards');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  // Centralized filter state
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    isActive: undefined,
    categoryId: undefined,
    status: undefined
  });

  // Dashboard stats hook
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useStoreDashboardStats(store?.id || '');

  // Cache refresh hook
  const refreshCache = useRefreshStoreCache();

  // Reward requests hook with status filter
  const {
    data: rewardRequests,
    isLoading: isRequestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useStoreRewardRequests(store?.id ?? "", filters.status);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRefreshData = async () => {
    if (!store?.id) return;

    try {
      await refreshCache.mutateAsync(store.id);
      await refetchStats();
      await refetchRequests();
      toast.success(t("Data refreshed successfully!"));
    } catch (error) {
      toast.error(t("Failed to refresh data"));
    }
  };

  const handleCreateRewardSuccess = () => {
    setIsCreateModalOpen(false);
    toast.success(t("Reward created successfully!"));
    // Stats will auto-refresh due to query invalidation
  };

  // Calculate counts from filtered data
  const filteredRequests = rewardRequests?.filter(request => {
    // Apply text search filter
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      const matchesTitle = request.reward.title.toLowerCase().includes(searchTerm);
      const matchesDescription = request.reward.description.toLowerCase().includes(searchTerm);
      const matchesUserName = request.user.name.toLowerCase().includes(searchTerm);

      if (!matchesTitle && !matchesDescription && !matchesUserName) {
        return false;
      }
    }

    // Apply category filter
    if (filters.categoryId && request.reward.categoryId !== filters.categoryId) {
      return false;
    }

    return true;
  }) || [];

  const totalRequests = filteredRequests.length;
  const pendingCount = filteredRequests.filter(r => r.status.toUpperCase() === 'PENDING').length;
  const fulfilledCount = filteredRequests.filter(r => r.status.toUpperCase() === 'FULFILLED').length;
  const cancelledCount = filteredRequests.filter(r => r.status.toUpperCase() === 'CANCELLED').length;

  // Filter change handlers
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      isActive: undefined,
      categoryId: undefined,
      status: undefined
    });
  };

  const handleClearFilters = () => {
    setFilters({
      query: "",
      isActive: undefined,
      categoryId: undefined,
      status: undefined
    });
  };

  // Status filter handlers
  const handleStatusFilter = (status?: 'PENDING' | 'FULFILLED' | 'CANCELLED') => {
    setFilters(prev => ({
      ...prev,
      status
    }));
  };

  if (isLoading || isRequestsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-lg animate-pulse"></div>
          </div>
          <Spinner />
          <div className="mt-6 text-slate-600 dark:text-slate-400 font-medium">
            {t('Loading rewards...')}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-bounce">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div className="text-center text-lg font-medium text-slate-700 dark:text-slate-300">
            {t('Redirecting to login...')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative pt-5">
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
            <button
              className={`px-6 py-3 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'rewards'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              onClick={() => setActiveTab('rewards')}
            >
              {t('Reward Requests')}
            </button>
            <button
              className={`px-6 py-3 font-semibold text-lg transition-colors border-b-2 ${activeTab === 'management'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              onClick={() => setActiveTab('management')}
            >
              {t('Rewards Management')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'rewards' ? (
          <div className="max-w-7xl mx-auto px-4">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalRequests}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t('Total Requests')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{fulfilledCount}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t('Fulfilled')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{pendingCount}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t('Pending')}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{cancelledCount}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{t('Cancelled')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search */}
                <div className="flex-1 min-w-[300px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    placeholder={t('Search by reward title, description, or user name...')}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>


                {/* Advanced Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                >
                  <Filter className="w-5 h-5" />
                  {t('Filters')}
                </button>

              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <RewardFilters
                    filters={{ ...filters, query: filters.query ?? "" }}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    onClear={handleClearFilters}
                    storeId={store?.id || ''}
                  />
                </div>
              )}
            </div>

            {/* Error Banner */}
            {(statsError || requestsError) && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <div className="text-red-700 dark:text-red-400 font-medium">
                      {t('Failed to load data')}
                    </div>
                    <div className="text-red-600 dark:text-red-500 text-sm">
                      {t('Some information may not be up to date. Try refreshing the page.')}
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshData}
                    className="ml-auto px-3 py-1 bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    {t('Retry')}
                  </button>
                </div>
              </div>
            )}

            {/* Rewards List */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                      {t('Reward Requests')}
                      {filters.status && (
                        <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                          - {t(filters.status)}
                        </span>
                      )}
                    </h2>
                    {(filters.query || filters.categoryId) && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t('Showing filtered results', { count: filteredRequests.length, total: rewardRequests?.length || 0 })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {(filters.query || filters.categoryId || filters.status) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {t('Clear all filters')}
                      </button>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">{filteredRequests.length}</span>
                      {filters.status ? ` ${t(filters.status)}` : ''} {t('requests')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {store &&
                  <RewardsList
                    storeId={store.id}
                    filters={{ ...filters, query: filters.query ?? "" }}
                  />
                }
              </div>
            </div>
          </div>
        ) : (
          <RewardsManagementPage />
        )}

        {/* Floating Add Reward Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl flex items-center justify-center text-white text-3xl transition-transform duration-300 hover:scale-110 hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          title={t('Add New Reward')}
        >
          <Plus className="w-8 h-8" />
          <span className="sr-only">{t('Add New Reward')}</span>
        </button>
      </div>

      {/* Create Reward Modal */}
      <CreateRewardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateRewardSuccess}
        storeId={store?.id || ''}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}