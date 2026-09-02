import { ReactNode, useState, useEffect, useCallback, useRef } from "react";
import { BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type GateStatus = "loading" | "ready" | "error";

const TIMEOUT_MS = 45000;

export function ApiWakeUpGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GateStatus>("loading");
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkHealth = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus("loading");

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const baseUrl = API_URL ? API_URL.replace(/\/+$/, "") : "";
      const healthUrl = `${baseUrl}/api/healthz`;

      const response = await fetch(healthUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`);
      }

      clearTimeout(timeoutId);
      setStatus("ready");
    } catch {
      clearTimeout(timeoutId);
      if (controller.signal.aborted && abortControllerRef.current !== controller) {
        return;
      }
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    checkHealth();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkHealth]);

  if (status === "ready") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Branding */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-primary">2nd PUC Notes</span>
          </div>

          {/* Error Card */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-8 flex flex-col items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Unable to connect to the server
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Please check your internet connection and try again.
            </p>

            <Button onClick={checkHealth} className="w-full sm:w-auto px-6">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Branding */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-primary">2nd PUC Notes</span>
        </div>

        {/* Loading Card */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-8 flex flex-col items-center">
          <div className="mb-6">
            <Spinner className="size-8 text-primary" />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5">
            Getting things ready for you...
          </h2>

          <p className="text-sm font-medium text-primary mb-4 flex items-center justify-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            Waking up the server
          </p>

          <p className="text-xs text-gray-500 max-w-xs">
            This may take a few seconds the first time you visit.
          </p>
        </div>
      </div>
    </div>
  );
}
