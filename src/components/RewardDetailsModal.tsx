"use client";
import { RewardStatus, UserReward } from "@/types/reward";
import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign, Gift, Mail, Tag, User, X, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RewardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rewardRequest: UserReward | null;
    onStatusUpdate: (rewardId: string, status: RewardStatus) => void;
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

export default function RewardDetailsModal({ isOpen, onClose, rewardRequest }: RewardDetailsModalProps) {
    const { t } = useTranslation();
    if (!isOpen || !rewardRequest) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {t('Reward Request Details')}
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {t('Request ID')} {rewardRequest.id.slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Status and Basic Info */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                    {rewardRequest.reward.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {rewardRequest.reward.description}
                                </p>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(rewardRequest.status)}`}>
                                {getStatusIcon(rewardRequest.status)}
                                <span className="capitalize">{t(rewardRequest.status)}</span>
                            </div>
                        </div>

                        {/* Reward Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="text-lg font-semibold text-blue-600">
                                            {rewardRequest.reward.pointsCost} {t('Points')}
                                        </div>
                                        <div className="text-sm text-blue-600/80">
                                            {t('Redemption Cost')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50">
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <div className="text-lg font-semibold text-purple-600">
                                            {rewardRequest.reward.category?.name || t('Uncategorized')}
                                        </div>
                                        <div className="text-sm text-purple-600/80">
                                            {t('Category')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        {rewardRequest.user && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    {t('Customer Information')}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {rewardRequest.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-800 dark:text-white">
                                                {rewardRequest.user.name}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {t('Customer Name')}
                                            </div>
                                        </div>
                                    </div>
                                    {'email' in rewardRequest.user && typeof rewardRequest.user.email === 'string' && rewardRequest.user.email ? (
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-slate-500" />
                                            <div>
                                                <div className="font-medium text-slate-800 dark:text-white">
                                                    {rewardRequest.user.email}
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {t('Email Address')}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                            <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {t('Timeline')}
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-800 dark:text-white">
                                            {t('Request Created')}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {rewardRequest.createdAt ? new Date(rewardRequest.createdAt).toLocaleString() : t('N/A')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-800 dark:text-white">
                                            {t('Last Updated')}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {typeof (rewardRequest as any)?.updatedAt === 'string' && (rewardRequest as any)?.updatedAt
                                                ? new Date((rewardRequest as any).updatedAt).toLocaleString()
                                                : (rewardRequest.createdAt ? new Date(rewardRequest.createdAt).toLocaleString() : t('N/A'))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}