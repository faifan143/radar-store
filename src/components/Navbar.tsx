"use client";
import Link from 'next/link';
import { useStoreAuth } from "@/context/StoreAuthContext";
import { useState } from 'react';
import { Radar, Gift, LogOut, Menu, X, User, Shield, Globe, LanguagesIcon } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { isAuthenticated, store, logout } = useStoreAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const pathname = usePathname()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  if (pathname == "/auth") return;

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="sticky top-0 z-50 w-full">
        {/* Glass morphism navbar */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-black/5">
          <div className="max-w-7xl mx-auto ">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Radar className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {t('Radar Store')}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Language Switcher */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-colors"
                  aria-label={t('Toggle language')}
                >
                  <LanguagesIcon className="w-5 h-5" />
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    {/* Store info */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {store?.name}
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-xs">
                          {t('Active')}
                        </div>
                      </div>
                    </div>


                    {/* Logout button */}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('Logout')}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <Shield className="w-4 h-4" />
                    {t('Sign In')}
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="p-6 space-y-6">
            {/* Language Switcher Mobile */}
            <button
              onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors w-full text-left"
            >
              <Globe className="w-5 h-5" />
              <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Store info card */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {store?.name}
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm">
                        {t('Active')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 transition-all duration-300 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {t('Logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-300 w-full"
              >
                <Shield className="w-5 h-5" />
                {t('Sign In')}
              </Link>
            )}

          </div>
        </div>
      </nav>
    </>
  );
}