// app/providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ReactNode, useState } from 'react';
import I18nProvider from '@/components/I18nProvider';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
        <Toaster position="top-right" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
