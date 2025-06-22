import { useState } from "react";
import { Gift, Edit, Trash2, MoreHorizontal, Calendar, Tag, DollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import { Reward } from "@/types/reward-managment";
import { useTranslation } from 'react-i18next';

interface RewardCardProps {
    reward: Reward;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    animationDelay?: number;
}

export default function RewardCard({
    reward,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onToggleStatus,
    animationDelay = 0
}: RewardCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { t } = useTranslation();

    const handleMenuClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
        setShowMenu(false);
    };

    const isExpired = reward.expiryDate && new Date(reward.expiryDate) < new Date();

    return (
        <div
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] animate-in slide-in-from-bottom-1 ${isSelected
                ? 'bg-blue-50 border-blue-200 shadow-lg shadow-blue-500/20 dark:bg-blue-900/20 dark:border-blue-700'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-black/5 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {/* Selection Checkbox */}
            <div className="absolute top-4 left-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                />
            </div>

            {/* Status Indicators */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {/* Active/Inactive Status */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${reward.isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400'
                    }`}>
                    {reward.isActive ? t('Active') : t('Inactive')}
                </div>

                {/* Warning Indicators */}
                {(isExpired) && (
                    <div className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-full text-xs font-medium">
                        {isExpired ? t('Expired') : t('Limit Reached')}
                    </div>
                )}

                {/* More Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10">
                            <div className="p-1">
                                <button
                                    onClick={(e) => handleMenuClick(e, onEdit)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title={t('Edit')}
                                >
                                    <Edit className="w-4 h-4" />
                                    {t('Edit Reward')}
                                </button>
                                <button
                                    onClick={(e) => handleMenuClick(e, onToggleStatus)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title={reward.isActive ? t('Deactivate') : t('Activate')}
                                >
                                    {reward.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                                    {reward.isActive ? t('Deactivate') : t('Activate')}
                                </button>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                <button
                                    onClick={(e) => handleMenuClick(e, onDelete)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title={t('Delete')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t('Delete Reward')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reward Icon */}
            <div className="mt-8 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Gift className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {/* Title and Description */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {reward.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1 line-clamp-2">
                        {reward.description}
                    </p>
                </div>

                {/* Reward Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Points Cost */}
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-white">
                                {reward.pointsCost}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {t('Points')}
                            </div>
                        </div>
                    </div>
                    {/* Category */}
                    {reward.category && (
                        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <Tag className="w-4 h-4 text-purple-500" />
                            <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1">
                                    {reward.category.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {t('Category')}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t('Created')}: {new Date(reward.createdAt).toLocaleDateString()}
                    </div>
                    {reward.expiryDate && (
                        <div className={`flex items-center gap-1 ${isExpired ? 'text-red-500' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            {t('Expires')}: {new Date(reward.expiryDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                        <Edit className="w-4 h-4" />
                        {t('Edit')}
                    </button>

                    <button
                        onClick={onToggleStatus}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${reward.isActive
                            ? 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            : 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                    >
                        {reward.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                        {reward.isActive ? t('Disable') : t('Enable')}
                    </button>
                </div>
            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}