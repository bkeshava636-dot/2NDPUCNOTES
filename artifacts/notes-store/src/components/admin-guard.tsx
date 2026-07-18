import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminMe } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";

export function AdminGuard({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: adminMe, isLoading, error } = useAdminMe();

  useEffect(() => {
    if (!isLoading && (!adminMe?.isAdmin || error)) {
      setLocation("/admin/login");
    }
  }, [adminMe, isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!adminMe?.isAdmin) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
