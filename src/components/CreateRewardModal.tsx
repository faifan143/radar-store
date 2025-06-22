import { useCreateReward, useStoreCategories } from "@/hooks/useStoreRewardRequests";
import { Calendar, DollarSign, Gift, Info, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';

interface CreateRewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    storeId: string;
}

export default function CreateRewardModal({ isOpen, onClose, onSuccess, storeId }: CreateRewardModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pointsCost: '',
        categoryId: '',
        isActive: true,
        expiryDate: '',
    });

    const createReward = useCreateReward();
    const { data: categories, isLoading: categoriesLoading } = useStoreCategories(storeId);
    const { t, i18n } = useTranslation();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                title: '',
                description: '',
                pointsCost: '',
                categoryId: '',
                isActive: true,
                expiryDate: '',
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.pointsCost) {
            toast.error(t("Please fill in all required fields"));
            return;
        }

        try {
            const submissionData = {
                storeId,
                title: formData.title,
                description: formData.description,
                pointsCost: parseInt(formData.pointsCost),
                isActive: formData.isActive,
                expiryDate: formData.expiryDate || undefined,
                category: formData.categoryId || "",
                // maxRedemptions: undefined // add if you support it in the form
            };

            await createReward.mutateAsync(submissionData);
            onSuccess();
        } catch {
            toast.error(t("Failed to create reward"));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `
            }} />
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
                                    {t('Create Reward')}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('Add a new reward to engage your customers')}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                {t('Basic Information')}
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t('Reward Title')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder={t('e.g., Free Coffee, 20% Discount')}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t('Description')} *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder={t('Describe what the customer gets with this reward...')}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reward Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                <Tag className="w-5 h-5 text-green-500" />
                                {t('Reward Details')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t('Points Cost')} *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 ${i18n.language === 'ar' ? 'right-3' : 'left-3'}`} />
                                        <input
                                            type="number"
                                            name="pointsCost"
                                            value={formData.pointsCost}
                                            onChange={handleChange}
                                            placeholder="100"
                                            min="1"
                                            className={`w-full py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t('Category')} *
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="">{t('Select a category')}</option>
                                        {categoriesLoading ? (
                                            <option disabled>{t('Loading categories...')}</option>
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
                        </div>

                        {/* Advanced Options */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                {t('Advanced Options')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        {t('Expiry Date')}
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="flex items-center pt-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {t('Make this reward active immediately')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={`flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 ${i18n.language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={createReward.isPending}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {createReward.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {t('Creating...')}
                                    </div>
                                ) : (
                                    t('Create Reward')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}