import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin Page Caught Error:", error, errorInfo);

    // Auto-reload once if dynamic import / lazy chunk failed due to a new deployment
    const isChunkFailure =
      error.message?.includes("Failed to fetch dynamically imported module") ||
      error.message?.includes("Importing a module script failed") ||
      error.message?.includes("error loading dynamically imported module");

    if (isChunkFailure && typeof window !== "undefined") {
      const lastChunkReload = sessionStorage.getItem("admin_chunk_reload");
      const now = Date.now();
      if (!lastChunkReload || now - parseInt(lastChunkReload, 10) > 10000) {
        sessionStorage.setItem("admin_chunk_reload", String(now));
        window.location.reload();
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-4 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-6 sm:p-8 max-w-lg w-full text-center shadow-xs space-y-5">
            <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#112542] dark:text-[#F1F5F9]">
                {this.props.fallbackTitle || "An unexpected error occurred"}
              </h2>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1.5 leading-relaxed">
                {this.state.error?.message || "A rendering or runtime exception occurred in the admin workspace."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                className="w-full sm:w-auto text-xs border-[#e2e8f0] dark:border-[#293548] text-[#112542] dark:text-[#F1F5F9] dark:hover:bg-[#1C2638] gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </Button>
              <a href="/admin/dashboard" className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="w-full text-xs bg-[#1856b8] hover:bg-[#124494] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white dark:text-[#0B0F19] dark:font-bold gap-1.5"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Return to Dashboard</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
