"use client";
import { Heart, Radar, Github, Twitter, Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Radar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {t('Radar Store')}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                {t('footer_description')}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('Quick Links')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/rewards" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Rewards')}
                  </a>
                </li>
                <li>
                  <a href="/analytics" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Analytics')}
                  </a>
                </li>
                <li>
                  <a href="/settings" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Settings')}
                  </a>
                </li>
                <li>
                  <a href="/help" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Help Center')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('Support')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/docs" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Documentation')}
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Contact Us')}
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Privacy Policy')}
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-slate-300 hover:text-white transition-colors hover:underline">
                    {t('Terms of Service')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>{t('copyright', { year: new Date().getFullYear() })}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <span>{t('Made with')}</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>{t('for amazing stores')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      </div>
    </footer>
  );
}