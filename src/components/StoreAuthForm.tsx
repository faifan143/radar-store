"use client";
import { useState } from "react";
import { useRequestStoreOtp, useVerifyStoreOtp } from "@/hooks/useStoreAuth";
import { useTranslation } from 'react-i18next';

export default function StoreAuthForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const requestOtp = useRequestStoreOtp();
  const verifyOtp = useVerifyStoreOtp();
  const { t } = useTranslation();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    requestOtp.mutate(
      { phone },
      {
        onSuccess: () => setStep("otp"),
      }
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp.mutate({ phone, otp });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow">
      {step === "phone" ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <label className="font-medium">{t('Phone Number')}</label>
          <input
            type="tel"
            className="border rounded px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder={t('Enter your phone number')}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
            disabled={requestOtp.isPending}
          >
            {requestOtp.isPending ? t('Sending...') : t('Send OTP')}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <label className="font-medium">{t('OTP')}</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            placeholder={t('Enter the OTP')}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
            disabled={verifyOtp.isPending}
          >
            {verifyOtp.isPending ? t('Verifying...') : t('Verify OTP')}
          </button>
        </form>
      )}
    </div>
  );
}
