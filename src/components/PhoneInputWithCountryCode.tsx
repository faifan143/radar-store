"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

interface PhoneInputWithCountryCodeProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const COUNTRIES_DATA = [
  { code: "SY", key: "Syria", dialCode: "+963" },
  { code: "SA", key: "Saudi Arabia", dialCode: "+966" },
  { code: "AE", key: "United Arab Emirates", dialCode: "+971" },
  { code: "QA", key: "Qatar", dialCode: "+974" },
  { code: "KW", key: "Kuwait", dialCode: "+965" },
  { code: "BH", key: "Bahrain", dialCode: "+973" },
  { code: "OM", key: "Oman", dialCode: "+968" },
  { code: "JO", key: "Jordan", dialCode: "+962" },
  { code: "LB", key: "Lebanon", dialCode: "+961" },
  { code: "IQ", key: "Iraq", dialCode: "+964" },
  { code: "PS", key: "Palestine", dialCode: "+970" },
  { code: "YE", key: "Yemen", dialCode: "+967" },
  { code: "EG", key: "Egypt", dialCode: "+20" },
  { code: "SD", key: "Sudan", dialCode: "+249" },
  { code: "DZ", key: "Algeria", dialCode: "+213" },
  { code: "MA", key: "Morocco", dialCode: "+212" },
  { code: "TN", key: "Tunisia", dialCode: "+216" },
  { code: "LY", key: "Libya", dialCode: "+218" },
  { code: "TR", key: "Turkey", dialCode: "+90" },
  { code: "DE", key: "Germany", dialCode: "+49" },
  { code: "FR", key: "France", dialCode: "+33" },
  { code: "GB", key: "United Kingdom", dialCode: "+44" },
  { code: "IT", key: "Italy", dialCode: "+39" },
  { code: "ES", key: "Spain", dialCode: "+34" },
  { code: "NL", key: "Netherlands", dialCode: "+31" },
  { code: "CH", key: "Switzerland", dialCode: "+41" },
  { code: "SE", key: "Sweden", dialCode: "+46" },
];

const PhoneInputWithCountryCode: React.FC<PhoneInputWithCountryCodeProps> = ({
  value,
  onChange,
  label,
  required = false,
}) => {
  const { t } = useTranslation();

  const COUNTRIES: Country[] = useMemo(
    () =>
      COUNTRIES_DATA.map(c => ({
        code: c.code,
        name: t(c.key),
        dialCode: c.dialCode,
      })),
    [t]
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES[0]
  );
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

  // Extract local part (without country code)
  const getLocalPart = () => value.replace(selectedCountry.dialCode, "");

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    // Update phone field with new country code
    let localPart = value.replace(/^\+\d+/, "");
    localPart = localPart.replace(/^0+/, "");
    onChange(country.dialCode + localPart);
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    val = val.replace(/^0+/, "");
    onChange(selectedCountry.dialCode + val);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneDropdownRef.current && !(phoneDropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // When language changes, update the selected country's name
    const currentSelected = COUNTRIES.find(
      c => c.code === selectedCountry.code
    );
    if (currentSelected) {
      setSelectedCountry(currentSelected);
    }
  }, [t, selectedCountry.code, COUNTRIES]);

  // Flag icon
  const FlagIcon = ({ countryCode, className = "" }: { countryCode: string; className?: string }) => (
    <img
      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
      alt={t('flag_alt', { countryCode })}
      className={`inline-block ${className}`}
      onError={e => {
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
        if (fallback) fallback.classList.remove('hidden');
      }}
    />
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
        {label || t("Phone Number")} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="phone-input-rtl">
        <div className="relative w-full" ref={phoneDropdownRef}>
          <div className="border border-gray-300 rounded-lg overflow-hidden transition-all">
            <div className="flex items-center h-12">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 h-full focus:outline-none hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex items-center mr-2">
                  <FlagIcon countryCode={selectedCountry.code} className="w-6 h-4" />
                </div>
                <span className="text-sm font-medium">{selectedCountry.code}</span>
                <svg className="h-4 w-4 text-gray-500 ml-2 transition-transform" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex-grow">
                <input
                  type="tel"
                  value={getLocalPart()}
                  onChange={handlePhoneChange}
                  className="w-full h-full p-4 focus:outline-none text-base bg-transparent"
                  dir="ltr"
                  placeholder={t('phone_placeholder')}
                  required={required}
                />
              </div>
              <div className="px-4 text-base font-medium text-gray-600">
                {selectedCountry.dialCode}
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
              {COUNTRIES.map((country) => (
                <div
                  key={country.code}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors ${selectedCountry.code === country.code ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center mr-3">
                      <FlagIcon countryCode={country.code} className="w-6 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{country.name}</span>
                      <span className="text-sm text-gray-500">{country.dialCode}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-gray-400">{country.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneInputWithCountryCode;
