import { useAuthStore } from '@/stores';
import { useTranslation } from 'react-i18next';

export function useStoreAuth() {
  const { t } = useTranslation();
  const authStore = useAuthStore();

  return authStore;
}