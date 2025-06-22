"use client";
import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
    type?: 'single' | 'bulk';
    count?: number;
    isLoading?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    type = 'single',
    count,
    isLoading = false
}: DeleteConfirmationModalProps) {
    const { t } = useTranslation();

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isLoading, onClose]);

    const handleConfirm = () => {
        onConfirm();
        // Don't close automatically - let the parent handle it after success
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                                {t(title)}
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t("Close modal")}
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <p id="modal-description" className="text-slate-700 dark:text-slate-300 mb-2">
                                    {t(message)}
                                </p>

                                {itemName && type === 'single' && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-3">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {t('Item to delete:')}
                                        </p>
                                        <p className="text-slate-900 dark:text-white font-semibold truncate">
                                            "{itemName}"
                                        </p>
                                    </div>
                                )}

                                {type === 'bulk' && count && count > 0 && (
                                    <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 mt-3">
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {t('bulk_delete_confirmation', { count })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Warning Text */}
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-amber-700 dark:text-amber-300 text-left">
                                        <strong>{t('Warning:')}</strong> {t('This action cannot be undone.')}{' '}
                                        {type === 'bulk'
                                            ? t('All selected items will be permanently removed from your system.')
                                            : t('This item will be permanently removed from your system.')}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                                >
                                    {t('Cancel')}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 min-w-[120px] justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('Deleting...')}
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            {type === 'bulk' && count ? t('Delete ({{count}})', { count }) : t('Delete')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}