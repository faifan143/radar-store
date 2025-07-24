import { useStoreRewardRequests, useUpdateUserRewardStatus } from "@/hooks/useStoreRewardRequests";
import { RewardStatus, UserReward } from "@/types/reward";
import { AlertCircle, Calendar, Check, CheckCircle, Clock, Eye, Gift, Sparkles, Trophy, User, X, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';

interface FilterState {
  query: string;
  isActive?: boolean;
  categoryId?: string;
  status?: 'PENDING' | 'FULFILLED' | 'CANCELLED';
}

interface RewardsListProps {
  storeId: string;
  filters?: FilterState;
  onViewDetails?: (reward: UserReward) => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return <Clock className="w-5 h-5 text-amber-500" />;
    case 'FULFILLED':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'CANCELLED':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-slate-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50';
    case 'FULFILLED':
      return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50';
  }
};

const getStatusText = (status: string, t: any) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return t('Pending');
    case 'FULFILLED':
      return t('Fulfilled');
    case 'CANCELLED':
      return t('Cancelled');
    default:
      return t('Unknown');
  }
};

export default function RewardsList({ storeId, filters, onViewDetails }: RewardsListProps) {
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
  const { t } = useTranslation();

  // Use the status filter from props if available
  const statusFilter = filters?.status;

  // Hooks
  const { data: rawData, isLoading, error, refetch } = useStoreRewardRequests(storeId, statusFilter);
  const updateStatus = useUpdateUserRewardStatus();
  // const bulkUpdate = useBulkUpdateRewardStatus();

  // Apply client-side filtering for text search and category
  const filteredData = rawData?.filter((request: UserReward) => {
    // Apply text search filter
    if (filters?.query) {
      const searchTerm = filters.query.toLowerCase();
      const matchesTitle = request.reward.title.toLowerCase().includes(searchTerm);
      const matchesDescription = request.reward.description.toLowerCase().includes(searchTerm);
      const matchesUserName = request.user.name.toLowerCase().includes(searchTerm);

      if (!matchesTitle && !matchesDescription && !matchesUserName) {
        return false;
      }
    }

    // Apply category filter
    if (filters?.categoryId && request.reward.categoryId !== filters.categoryId) {
      return false;
    }

    return true;
  }) || [];

  const data = filteredData;

  // Handle individual status update
  const handleStatusUpdate = async (rewardId: string, newStatus: RewardStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: rewardId,
        status: newStatus
      });
      toast.success(t('Reward {{status}} successfully!', { status: getStatusText(newStatus, t) }));
    } catch (error) {
      console.log(error);

      toast.error(t('Failed to {{status}} reward', { status: getStatusText(newStatus, t) }));
    }
  };

  // Handle bulk status update
  // const handleBulkUpdate = async (status: string) => {
  //   if (selectedRewards.length === 0) {
  //     toast.error(t('Please select rewards to update'));
  //     return;
  //   }

  //   try {
  //     await bulkUpdate.mutateAsync({
  //       ids: selectedRewards,
  //       status,
  //       storeId
  //     });
  //     toast.success(t('{{count}} rewards {{status}} successfully!', { count: selectedRewards.length, status: getStatusText(status, t) }));
  //     setSelectedRewards([]);
  //   } catch (error) {
  //     console.log(error);

  //     toast.error(t('Failed to bulk {{status}} rewards', { status: getStatusText(status, t) }));
  //   }
  // };

  // Handle select/deselect rewards
  const handleSelectReward = (rewardId: string) => {
    setSelectedRewards(prev =>
      prev.includes(rewardId)
        ? prev.filter(id => id !== rewardId)
        : [...prev, rewardId]
    );
  };

  // const handleSelectAll = () => {
  //   if (!data) return;

  //   if (selectedRewards.length === data.length) {
  //     setSelectedRewards([]);
  //   } else {
  //     setSelectedRewards(data.map(reward => reward.id));
  //   }
  // };

  // Handle view details
  const handleViewDetails = (reward: UserReward) => {
    if (onViewDetails) {
      onViewDetails(reward);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
          {t('Failed to load rewards')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('There was an error loading your reward requests. Please try again.')}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          {t('Retry')}
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto">
            <Gift className="w-10 h-10 text-blue-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          {filters?.query || filters?.categoryId || filters?.status
            ? t('No matching requests found')
            : t('No reward requests yet')
          }
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          {filters?.query || filters?.categoryId || filters?.status
            ? t('Try adjusting your filters to see more results.')
            : t('When customers redeem rewards, they\'ll appear here for your review and approval.')
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {/* {selectedRewards.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-blue-700 dark:text-blue-300 font-medium">
              {selectedRewards.length} {t('selected')} {t('requests', { count: selectedRewards.length })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkUpdate('FULFILLED')}
                disabled={bulkUpdate.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {t('Approve All')}
              </button>
              <button
                onClick={() => handleBulkUpdate('CANCELLED')}
                disabled={bulkUpdate.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {t('Reject All')}
              </button>
              <button
                onClick={() => setSelectedRewards([])}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                {t('Clear')}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* List header */}
      {/* <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={data.length > 0 && selectedRewards.length === data.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t('Select all')}
          </span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {data.length} {filters?.query || filters?.categoryId ? t('filtered') : t('total')} {t('requests', { count: data.length })}
        </div>
      </div> */}

      {/* Rewards list */}
      <div className="space-y-4">
        {data.map((reward, index) => (
          <div
            key={reward.id}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 transform hover:scale-[1.01] animate-in slide-in-from-bottom-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Selection checkbox */}
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={selectedRewards.includes(reward.id)}
                  onChange={() => handleSelectReward(reward.id)}
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Reward icon */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  {getStatusIcon(reward.status)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {reward.reward.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      {reward.reward.description}
                    </p>
                    {reward.user && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                        <User className="w-4 h-4" />
                        <span>{t('Requested by')}: <span className="font-medium text-slate-700 dark:text-slate-300">{reward.user.name}</span></span>
                        {reward.user.phone && (
                          <span className="text-slate-400">({reward.user.phone})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(reward.status)}`}>
                    {getStatusIcon(reward.status)}
                    <span className="capitalize">{getStatusText(reward.status, t)}</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t('Created')}: {new Date(reward.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{t('ID')}: {reward.id.slice(0, 8)}</span>
                  </div>
                  {reward.reward.pointsCost && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{reward.reward.pointsCost} {t('Points')}</span>
                    </div>
                  )}
                  {reward.reward.category && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{reward.reward.category.name}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button
                    onClick={() => handleViewDetails(reward)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    {t('View Details')}
                  </button>

                  {reward.status.toUpperCase() === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(reward.id, 'FULFILLED')}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {updateStatus.isPending ? t('Approving...') : t('Approve')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reward.id, 'CANCELLED')}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        {updateStatus.isPending ? t('Rejecting...') : t('Reject')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {data.length >= 10 && (
        <div className="text-center pt-8">
          <button className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/30">
            {t('Load More Rewards')}
          </button>
        </div>
      )}


    </div>
  );
}