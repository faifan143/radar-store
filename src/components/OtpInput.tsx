"use client";
import { useState } from "react";
import { OTPInput } from "input-otp";
import { useTranslation } from "react-i18next";

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false
}: {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
}) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <div className="relative" dir="ltr">
      <OTPInput
        maxLength={length}
        value={value}
        onChange={onChange}
        inputMode="numeric"
        containerClassName="flex gap-3 justify-center"
        dir="ltr"
        render={({ slots }) => (
          <>
            {slots.map((slot, idx) => {
              const isActive = slot.isActive || focusedIndex === idx;
              const hasValue = slot.char !== null && slot.char !== undefined;

              return (
                <div
                  key={idx}
                  onFocus={() => setFocusedIndex(idx)}
                  onBlur={() => setFocusedIndex(null)}
                  tabIndex={0}
                  dir="ltr"
                  className={`relative w-12 h-16 flex items-center justify-center border-2 rounded-2xl text-2xl font-bold transition-all duration-300 transform ${isActive
                    ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-105 bg-blue-50 dark:bg-blue-900/20'
                    : hasValue
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20 shadow-md'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
                    }`}
                >
                  {/* Background glow effect */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-sm"></div>
                  )}

                  {/* Input character */}
                  <span
                    dir="ltr" className={`relative z-10 ${hasValue
                      ? 'text-slate-800 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                      }`}>
                    {slot.char ?? (
                      <span className="select-none">
                        {isActive ? (
                          <div className="w-0.5 h-6 bg-blue-500 animate-pulse"></div>
                        ) : (
                          '•'
                        )}
                      </span>
                    )}
                  </span>

                  {/* Animated caret */}
                  {slot.hasFakeCaret && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-0.5 h-6 bg-blue-500 animate-pulse"></div>
                    </div>
                  )}

                  {/* Success checkmark animation */}
                  {hasValue && !isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        disabled={disabled}
      />

      {/* Helper text */}
      <div className="text-center mt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('otp_helper_text', { length })}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {Array.from({ length }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-1 rounded-full transition-all duration-300 ${idx < value.length
                ? 'bg-green-500'
                : idx === value.length && focusedIndex === idx
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-600'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}