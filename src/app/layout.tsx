// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radar Store",
  description: "Radar Store - Smart rewards and store management platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const i18nCookie = cookieStore.get('i18n-storage');
  let lang = 'ar';
  if (i18nCookie) {
    const i18nData = JSON.parse(i18nCookie.value);
    lang = i18nData.state.language;
  }
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased hide-scrollbar`}>
        <Providers>
          {/* Navigation */}
          <Navbar />
          {/* Main Content */}
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}