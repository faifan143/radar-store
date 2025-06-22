"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRequestStoreOtp, useVerifyStoreOtp } from "@/hooks/useStoreAuth";
import PhoneInputWithCountryCode from "@/components/PhoneInputWithCountryCode";
import OtpInput from "@/components/OtpInput";
import { useAuthStore } from "@/stores";
import { ArrowLeft, Shield, Smartphone, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const requestOtp = useRequestStoreOtp();
  const verifyOtp = useVerifyStoreOtp();
  const { login } = useAuthStore();

  useEffect(() => {
    if (
      step === "otp" &&
      otp.length === 6 &&
      !verifyOtp.isPending &&
      !verifyOtp.isSuccess &&
      !verifyOtp.isError
    ) {
      verifyOtp.mutate(
        { phone, otp },
        {
          onSuccess: (data) => {
            if (data.store) {
              login(data.store);
              // Note: With Zustand persistence, we don't need manual localStorage for store info
              // But we can still store the token separately if needed
              if (typeof window !== "undefined") {
                localStorage.setItem('store_token', data.token);
              }
            } else {
              toast.error(t("Login failed: missing store info."));
              return;
            }
            setSuccessMsg(t("Verification successful! Redirecting..."));
            toast.success(t("Verification successful! Redirecting..."));
            setTimeout(() => {
              router.push("/rewards");
            }, 1200);
          },
          onError: (err: unknown) => {
            toast.error(t((err as Error)?.message || "Failed to verify OTP. Please try again."));
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            {/* Header with icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                {t('Store Access')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {t('Secure authentication for store management')}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 ${step === "phone"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-green-500 text-white"
                  }`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step === "otp" ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                  }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-300 ${step === "otp"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-300 dark:bg-slate-600 text-slate-500"
                  }`}>
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>

            {step === "phone" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('Phone Number')}
                  </label>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      setSuccessMsg(null);
                      requestOtp.mutate(
                        { phone },
                        {
                          onSuccess: (data) => {
                            setStep("otp");
                            setSuccessMsg(data.message ? t(data.message) : t("OTP sent successfully!"));
                            toast.success(data.message ? t(data.message) : t("OTP sent successfully!"));
                          },
                          onError: (err: unknown) => {
                            toast.error(t((err as Error)?.message || "Failed to send OTP. Please try again."));
                          }
                        }
                      );
                    }}
                    className="space-y-6"
                  >
                    <PhoneInputWithCountryCode
                      value={phone}
                      onChange={setPhone}
                      required
                    />

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-4 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={!phone || requestOtp.isPending}
                    >
                      {requestOtp.isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {t('Sending OTP...')}
                        </div>
                      ) : (
                        t('Send Verification Code')
                      )}
                    </button>
                  </form>
                </div>

                {requestOtp.isError && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                    <div className="text-red-700 dark:text-red-400 text-sm font-medium">
                      {requestOtp.error?.message || t("Failed to send OTP. Please check your number and try again.")}
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="text-green-700 dark:text-green-400 text-sm font-medium">
                      {successMsg}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={() => setStep("phone")}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-sm font-medium mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('Change phone number')}
                </button>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                    {t('Enter verification code')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {t('We sent a 6-digit code to')} {phone}
                  </p>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setSuccessMsg(null);
                    verifyOtp.mutate(
                      { phone, otp },
                      {
                        onSuccess: (data) => {
                          if (data.store) {
                            login(data.store);
                            if (typeof window !== "undefined") {
                              localStorage.setItem('store_token', data.token);
                            }
                          } else {
                            toast.error(t("Login failed: missing store info."));
                            return;
                          }

                          setSuccessMsg(t("Verification successful! Redirecting..."));
                          toast.success(t("Verification successful! Redirecting..."));
                          setTimeout(() => {
                            router.push("/rewards");
                          }, 1200);
                        },
                        onError: (err: unknown) => {
                          toast.error(t((err as Error)?.message || "Failed to verify OTP. Please try again."));
                        }
                      }
                    );
                  }}
                  className="space-y-6"
                >
                  <div className="flex justify-center">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                      disabled={verifyOtp.isPending}
                    />
                  </div>

                </form>

                {verifyOtp.isError && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                    <div className="text-red-700 dark:text-red-400 text-sm font-medium">
                      {verifyOtp.error?.message || t("Failed to verify OTP. Please check the code and try again.")}
                    </div>
                  </div>
                )}

                {/* {successMsg && !verifyOtp.isError && (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="text-green-700 dark:text-green-400 text-sm font-medium">
                      {successMsg}
                    </div>
                  </div>
                )} */}

                <div className="text-center">
                  <button
                    onClick={() => {
                      setOtp("");
                      requestOtp.mutate({ phone });
                    }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={requestOtp.isPending}
                  >
                    {t("Didn't receive code? Resend")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-white/20 dark:border-slate-700/50">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {t('Your data is encrypted and secure')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}