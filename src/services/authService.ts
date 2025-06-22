import apiClient from '../utils/apiClient';
import { StoreAuthRequestOtp, StoreAuthVerifyOtp, StoreAuthResponse } from '../types/auth';

export const requestStoreOtp = async (payload: StoreAuthRequestOtp): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.post('/stores/auth/request-otp', payload);
  return data;
};

export const verifyStoreOtp = async (payload: StoreAuthVerifyOtp): Promise<StoreAuthResponse> => {
  const { data } = await apiClient.post('/stores/auth/verify-otp', payload);
  return data;
};
