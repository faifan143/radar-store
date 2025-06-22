// components/AuthGuard.tsx (optional - for protecting routes)
"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const { isAuthenticated, isLoading, setLoading } = useAuthStore();

    useEffect(() => {
        // Ensure loading state is properly managed on mount
        const timer = setTimeout(() => {
            if (isLoading) {
                setLoading(false);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isLoading, setLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback || <div>Please log in to continue</div>;
    }

    return <>{children}</>;
}
