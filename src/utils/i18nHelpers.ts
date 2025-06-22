// utils/i18nHelpers.ts (helper functions for language switching)
import { useI18nStore } from '@/stores';
import i18n from '@/i18n';

export const useLanguageSwitch = () => {
    const { setLanguage } = useI18nStore();

    const switchLanguage = (newLanguage: string) => {
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage);
    };

    return { switchLanguage };
};