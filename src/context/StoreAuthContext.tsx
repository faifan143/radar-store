import { useAuthStore } from '@/stores';
import { useTranslation } from 'react-i18next';

export function useStoreAuth() {
  useTranslation();
  const authStore = useAuthStore();

  return authStore;
}