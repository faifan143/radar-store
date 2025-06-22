// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '@/types/store';

interface AuthState {
    store: Store | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (store: Store) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            store: null,
            isAuthenticated: false,
            isLoading: true,
            login: (store: Store) => {
                set({ store, isAuthenticated: true });
            },
            logout: () => {
                set({ store: null, isAuthenticated: false });
            },
            setLoading: (isLoading: boolean) => {
                set({ isLoading });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                store: state.store,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                // Set loading to false after rehydration
                if (state) {
                    state.setLoading(false);
                }
            },
        }
    )
);
