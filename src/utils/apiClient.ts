import axios, { AxiosInstance } from 'axios';
import { useTranslation } from 'react-i18next';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('store_token') : null;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      import('react-hot-toast').then(({ toast }) => {
        import('react-i18next').then(({ useTranslation }) => {
          const { t } = useTranslation();
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An unexpected error occurred';
          toast.error(t(message), {
            id: 'api-error',
            duration: 5000,
            position: 'top-right',
            style: {
              borderRadius: '8px',
              background: '#1a1a1a',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
            },
          });
        });
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
