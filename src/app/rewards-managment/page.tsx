"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores";
import { Reward } from "@/types/reward-managment";
import { useRewardManagement } from "@/hooks/useRewardsManagment";
import toast from "react-hot-toast";
import { Download, Eye, Filter, Gift, Plus, Search, ToggleLeft } from "lucide-react";
import CreateRewardModal from "@/components/CreateRewardModal";
import RewardFilters from "@/components/RewardFilters";
import BulkActionsBar from "@/components/BulkActionsBar";
import RewardCard from "@/components/RewardCard";
import EditRewardModal from "@/components/EditRewardModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useTranslation } from 'react-i18next';

interface DeleteAction {
    type: 'single' | 'bulk';
    reward?: Reward;
    count?: number;
}

export default function RewardsManagementPage() {
    const { store } = useAuthStore();
    const [selectedRewards, setSelectedRewards] = useState<string[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteAction, setDeleteAction] = useState<DeleteAction | null>(null);
    const { t } = useTranslation();

    const {
        rewards,
        pagination,
        isLoading,
        isError,
        filters,
        updateFilter,
        resetFilters,
        clearFilters,
        createReward,
        updateReward,
        deleteReward,
        toggleStatus,
        bulkUpdate,
        bulkDelete,
        refetch
    } = useRewardManagement(store?.id || "", { query: searchQuery });

    // Safe calculations with fallbacks
    const safeRewards = rewards || [];
    const totalRewards = pagination?.total || 0;
    const activeRewards = safeRewards.filter(r => r?.isActive).length || 0;
    const totalRedemptions = safeRewards.reduce((sum, r) => sum + (r?.currentRedemptions || 0), 0);
    const avgPointsCost = safeRewards.length > 0
        ? Math.round(safeRewards.reduce((sum, r) => sum + (r?.pointsCost || 0), 0) / safeRewards.length)
        : 0;

    // Handle selection
    const handleSelectReward = (rewardId: string) => {
        setSelectedRewards(prev =>
            prev.includes(rewardId)
                ? prev.filter(id => id !== rewardId)
                : [...prev, rewardId]
        );
    };

    const handleSelectAll = () => {
        if (selectedRewards.length === safeRewards.length) {
            setSelectedRewards([]);
        } else {
            setSelectedRewards(safeRewards.map(reward => reward.id));
        }
    };

    // Handle actions
    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        toast.success(t('Reward created successfully!'));
    };

    const handleEditSuccess = () => {
        setEditingReward(null);
        toast.success(t('Reward updated successfully!'));
    };

    // Delete confirmation handlers
    const handleDeleteReward = (reward: Reward) => {
        setDeleteAction({ type: 'single', reward });
    };

    const handleBulkDeleteConfirm = () => {
        if (selectedRewards.length === 0) {
            toast.error(t('Please select rewards first'));
            return;
        }
        setDeleteAction({ type: 'bulk', count: selectedRewards.length });
    };

    const confirmDelete = async () => {
        if (!deleteAction) return;

        try {
            if (deleteAction.type === 'single' && deleteAction.reward) {
                await deleteReward.mutateAsync({
                    id: deleteAction.reward.id,
                    storeId: store?.id || ""
                });
                toast.success(t('Reward deleted successfully!'));
            } else if (deleteAction.type === 'bulk') {
                await bulkDelete.mutateAsync({
                    storeId: store?.id || "",
                    data: { ids: selectedRewards }
                });
                toast.success(t('{{count}} rewards deleted successfully!', { count: selectedRewards.length }));
                setSelectedRewards([]);
            }
            setDeleteAction(null);
        } catch (error) {
            toast.error(t('Failed to delete reward(s)'));
        }
    };

    const handleToggleStatus = async (reward: Reward) => {
        try {
            await toggleStatus.mutateAsync({
                id: reward.id,
                storeId: store?.id || "",
                isActive: !reward.isActive
            });
            toast.success(t('Reward {{status}} successfully!', { status: !reward.isActive ? t('activated') : t('deactivated') }));
        } catch (error) {
            toast.error(t('Failed to update reward status'));
        }
    };

    const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
        if (selectedRewards.length === 0) {
            toast.error(t('Please select rewards first'));
            return;
        }

        if (action === 'delete') {
            handleBulkDeleteConfirm();
            return;
        }

        try {
            await bulkUpdate.mutateAsync({
                storeId: store?.id || "",
                data: {
                    ids: selectedRewards,
                    data: { isActive: action === 'activate' }
                }
            });
            toast.success(t('{{count}} rewards {{action}}d successfully!', { count: selectedRewards.length, action: t(action) }));
            setSelectedRewards([]);
        } catch (error) {
            toast.error(t('Failed to {{action}} rewards', { action: t(action) }));
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        updateFilter('query', query);
    };

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 animate-pulse">
                            <Gift className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-lg animate-pulse"></div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                                {t('Authentication Required')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                {t('Please log in to your store account to access the rewards management dashboard.')}
                            </p>

                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/auth'}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                            >
                                {t('Go to Login')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            <div className="max-w-7xl mx-auto">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Gift className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {totalRewards}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Total Rewards')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <ToggleLeft className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {activeRewards}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Active Rewards')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {totalRedemptions}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Total Redemptions')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                <Gift className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {avgPointsCost}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Avg Points Cost')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-center ">
                    {/* Search and Filters */}
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 mb-6  w-full">
                        <div className="flex items-center gap-4 flex-wrap  ">
                            {/* Search */}
                            <div className="flex-1 min-w-[300px] relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder={t('Search rewards...')}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Filter Toggle */}
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

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                <RewardFilters
                                    filters={{ ...filters, query: filters.query ?? "" }}
                                    onFilterChange={updateFilter as any}
                                    onReset={resetFilters}
                                    onClear={clearFilters}
                                    storeId={store.id}
                                />
                            </div>
                        )}
                    </div>

                    {/* Bulk Actions */}
                    {selectedRewards.length > 0 && (
                        <BulkActionsBar
                            selectedCount={selectedRewards.length}
                            onActivate={() => handleBulkAction('activate')}
                            onDeactivate={() => handleBulkAction('deactivate')}
                            onDelete={() => handleBulkAction('delete')}
                            onClear={() => setSelectedRewards([])}
                            isLoading={bulkUpdate.isPending || bulkDelete.isPending}
                        />
                    )}
                </div>

                {/* Rewards Grid */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl overflow-hidden">
                    {/* List Header */}
                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedRewards.length === safeRewards.length && safeRewards.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                                />
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                    {t('Your Rewards')} ({totalRewards})
                                </h2>
                            </div>

                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                {selectedRewards.length > 0 && `${selectedRewards.length} ${t('selected')}`}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, idx) => (
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
                        ) : isError ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                    {t('Failed to load rewards')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    {t('There was an error loading your rewards. Please try again.')}
                                </p>
                                <button
                                    onClick={() => refetch()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    {t('Try Again')}
                                </button>
                            </div>
                        ) : safeRewards.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Gift className="w-10 h-10 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                                    {t('No rewards found')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                    {filters.query ? t('No rewards match your search criteria.') : t('Create your first reward to start engaging customers.')}
                                </p>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                                >
                                    {t('Create Your First Reward')}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {safeRewards.map((reward, index) => (
                                    <RewardCard
                                        key={reward.id}
                                        reward={reward}
                                        isSelected={selectedRewards.includes(reward.id)}
                                        onSelect={() => handleSelectReward(reward.id)}
                                        onEdit={() => setEditingReward(reward)}
                                        onDelete={() => handleDeleteReward(reward)}
                                        onToggleStatus={() => handleToggleStatus(reward)}
                                        animationDelay={index * 100}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Showing')} {((pagination.page - 1) * pagination.limit) + 1} {t('to')} {Math.min(pagination.page * pagination.limit, pagination.total)} {t('of')} {pagination.total} {t('rewards')}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateFilter('page', pagination.page - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {t('Previous')}
                                    </button>

                                    <span className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {t('Page')} {pagination.page} {t('of')} {pagination.totalPages}
                                    </span>

                                    <button
                                        onClick={() => updateFilter('page', pagination.page + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {t('Next')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateRewardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                storeId={store.id}
            />

            {editingReward && (
                <EditRewardModal
                    isOpen={!!editingReward}
                    onClose={() => setEditingReward(null)}
                    onSuccess={handleEditSuccess}
                    reward={editingReward}
                    storeId={store.id}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!deleteAction}
                onClose={() => setDeleteAction(null)}
                onConfirm={confirmDelete}
                title={deleteAction?.type === 'bulk' ? t('Delete Multiple Rewards') : t('Delete Reward')}
                message={
                    deleteAction?.type === 'bulk'
                        ? t('Are you sure you want to delete {{count}} selected rewards?', { count: deleteAction.count })
                        : t('Are you sure you want to delete this reward?')
                }
                itemName={deleteAction?.reward?.title}
                type={deleteAction?.type}
                count={deleteAction?.count}
                isLoading={deleteReward.isPending || bulkDelete.isPending}
            />
        </div>
    );
}