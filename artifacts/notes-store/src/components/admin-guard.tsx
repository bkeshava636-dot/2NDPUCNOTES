import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminMe, getAdminMeQueryKey } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LogIn } from "lucide-react";
import { getAdminToken, clearAdminToken } from "@/lib/utils";

export function AdminGuard({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const token = getAdminToken();

  // If there is no token in localStorage, redirect immediately without querying the backend
  useEffect(() => {
    if (!token) {
      setLocation("/admin/login");
    }
  }, [token, setLocation]);

  const { data: adminMe, isLoading, isError, error, refetch } = useAdminMe({
    query: {
      queryKey: getAdminMeQueryKey(),
      enabled: Boolean(token),
      staleTime: 10 * 60 * 1000, // 10 minutes session reuse
      gcTime: 30 * 60 * 1000,
      retry: 2,
    },
  });

  useEffect(() => {
    // Only redirect if backend definitively responded with 401 Unauthorized
    if (token && !isLoading && (isError && (error as any)?.status === 401)) {
      clearAdminToken();
      setLocation("/admin/login");
    }
  }, [token, isLoading, isError, error, setLocation]);

  if (!token) {
    return null;
  }

  // If query is actively loading and we don't have cached authorization yet
  if (isLoading && !adminMe) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] flex flex-col items-center gap-3 shadow-2xs max-w-sm w-full text-center">
          <Spinner className="size-6 text-[#1856b8]" />
          <div>
            <h3 className="text-xs font-semibold text-[#112542]">Loading admin workspace...</h3>
            <p className="text-[11px] text-[#64748b] mt-0.5">Initializing management console</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError && (error as any)?.status !== 401) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] flex flex-col items-center gap-4 shadow-2xs max-w-md w-full text-center">
          <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#112542]">Admin Verification Issue</h3>
            <p className="text-xs text-[#64748b] mt-1">
              Unable to reach the verification server. This could be due to network latency or temporary backend cold start.
            </p>
          </div>
          <div className="flex gap-2 w-full justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 text-xs border-[#e2e8f0]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                clearAdminToken();
                setLocation("/admin/login");
              }}
              className="gap-1.5 text-xs bg-[#2f74de] hover:bg-[#1f63c8] text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In Again</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If token is present and hasn't been rejected by 401, allow render
  return <>{children}</>;
}
