import { useMutation } from '@tanstack/react-query';
import { requestStoreOtp, verifyStoreOtp } from '../services/authService';
import { StoreAuthRequestOtp, StoreAuthVerifyOtp, StoreAuthResponse } from '../types/auth';

export function useRequestStoreOtp() {
  return useMutation<{ success: boolean; message: string }, Error, StoreAuthRequestOtp>({
    mutationFn: requestStoreOtp,
  });
}

export function useVerifyStoreOtp() {
  return useMutation<StoreAuthResponse, Error, StoreAuthVerifyOtp>({
    mutationFn: verifyStoreOtp,
  });
}
