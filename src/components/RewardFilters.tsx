import { useStoreCategories } from "@/hooks/useStoreRewardRequests";
import { Filter, RotateCcw, X } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface FilterState {
    query: string;
    isActive?: boolean;
    categoryId?: string;
    status?: 'PENDING' | 'FULFILLED' | 'CANCELLED';
}

interface RewardFiltersProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
    onReset: () => void;
    onClear: () => void;
    storeId: string;
}

export type { FilterState };

export default function RewardFilters({
    filters,
    onFilterChange,
    onReset,
    onClear,
    storeId
}: RewardFiltersProps) {
    const { data: categories, isLoading: categoriesLoading } = useStoreCategories(storeId);
    const { t } = useTranslation();

    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === 'query') {
            return value && value !== '';
        }
        return value !== undefined && value !== '' && value !== null;
    });

    return (
        <div className="space-y-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                        {t('Filter Rewards')}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            {t('Clear filters')}
                        </button>
                    )}

                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t('Reset')}
                    </button>
                </div>
            </div>

            {/* Filter Controls - Category and Status Only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('Status')}
                    </label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange('status', e.target.value || undefined)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                        <option value="">{t('All')}</option>
                        <option value="PENDING">{t('Pending')}</option>
                        <option value="FULFILLED">{t('Fulfilled')}</option>
                        <option value="CANCELLED">{t('Cancelled')}</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('Category')}
                    </label>
                    <select
                        value={filters.categoryId || ''}
                        onChange={(e) => onFilterChange('categoryId', e.target.value || undefined)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        disabled={categoriesLoading}
                    >
                        <option value="">{t('All')}</option>
                        {categoriesLoading ? (
                            <option disabled>{t('Loading...')}</option>
                        ) : (
                            categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {/* Filter Summary */}
            {hasActiveFilters && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                            {t('Active filters:')}
                        </span>

                        <div className="flex items-center gap-2 flex-wrap">
                            {filters.status && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                                    {t('Status:')} {filters.status}
                                    <button
                                        onClick={() => onFilterChange('status', undefined)}
                                        className="hover:text-blue-900 dark:hover:text-blue-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.categoryId && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-md">
                                    {t('Category:')} {categories?.find(c => c.id === filters.categoryId)?.name || t('Unknown')}
                                    <button
                                        onClick={() => onFilterChange('categoryId', undefined)}
                                        className="hover:text-purple-900 dark:hover:text-purple-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.query && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-md">
                                    {t('Search:')} {filters.query}
                                    <button
                                        onClick={() => onFilterChange('query', '')}
                                        className="hover:text-green-900 dark:hover:text-green-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {filters.isActive !== undefined && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                                    {t('Status:')} {filters.isActive ? t('Active') : t('Inactive')}
                                    <button
                                        onClick={() => onFilterChange('isActive', undefined)}
                                        className="hover:text-blue-900 dark:hover:text-blue-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.categoryId && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-md">
                                    {t('Category:')} {categories?.find(c => c.id === filters.categoryId)?.name || t('Unknown')}
                                    <button
                                        onClick={() => onFilterChange('categoryId', undefined)}
                                        className="hover:text-purple-900 dark:hover:text-purple-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}

                            {filters.query && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-md">
                                    {t('Search:')} {filters.query}
                                    <button
                                        onClick={() => onFilterChange('query', undefined)}
                                        className="hover:text-green-900 dark:hover:text-green-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}