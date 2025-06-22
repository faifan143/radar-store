import { Check, X, Trash2, ToggleLeft, ToggleRight, XCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface BulkActionsBarProps {
    selectedCount: number;
    onActivate: () => void;
    onDeactivate: () => void;
    onDelete: () => void;
    onClear: () => void;
    isLoading?: boolean;
}

export default function BulkActionsBar({
    selectedCount,
    onActivate,
    onDeactivate,
    onDelete,
    onClear,
    isLoading = false
}: BulkActionsBarProps) {
    const { t } = useTranslation();

    return (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-blue-700 dark:text-blue-300 font-medium">
                        {t('selectedCountLabel', { count: selectedCount })} {t('selected')}
                    </div>

                    <div className="h-4 w-px bg-blue-300 dark:bg-blue-700"></div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onActivate}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-green-500/30"
                        >
                            <ToggleRight className="w-4 h-4" />
                            {t('Activate')}
                        </button>

                        <button
                            onClick={onDeactivate}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-gray-500/30"
                        >
                            <ToggleLeft className="w-4 h-4" />
                            {t('Deactivate')}
                        </button>

                        <button
                            onClick={onDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-red-500/30"
                        >
                            <Trash2 className="w-4 h-4" />
                            {t('Delete')}
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClear}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                    <XCircle className="w-4 h-4" />
                    {t('Clear Selection')}
                </button>
            </div>

            {isLoading && (
                <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-sm">{t('Processing...')}</span>
                </div>
            )}
        </div>
    );
}