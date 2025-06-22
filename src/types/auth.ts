/**
 * Store Authentication Types
 * @module types/auth
 */
export interface StoreAuthRequestOtp {
  phone: string;
}

export interface StoreAuthVerifyOtp {
  phone: string;
  otp: string;
}

export interface StoreAuthResponse {
  success: boolean;
  token: string;
  store: import('./store').Store;
}
