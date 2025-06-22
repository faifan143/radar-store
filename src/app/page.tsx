"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoreAuth } from "@/context/StoreAuthContext";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { isAuthenticated, isLoading } = useStoreAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/rewards");
      } else {
        router.replace("/auth");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner />
      <div className="mt-4 text-gray-500">Checking authentication...</div>
    </div>
  );
}
