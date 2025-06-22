// stores/i18nStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface I18nState {
    language: string;
    setLanguage: (language: string) => void;
}

export const useI18nStore = create<I18nState>()(
    persist(
        (set) => ({
            language: 'ar',
            setLanguage: (language: string) => {
                set({ language });
            },
        }),
        {
            name: 'i18n-storage',
            storage: createJSONStorage(() => ({
                getItem: (name) => {
                    const value = getCookie(name);
                    return typeof value === 'string' ? value : null;
                },
                setItem: (name, value) => {
                    setCookie(name, value);
                },
                removeItem: (name) => {
                    deleteCookie(name);
                },
            })),
        }
    )
);
