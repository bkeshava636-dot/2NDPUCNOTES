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
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 max-w-lg w-full text-center shadow-xs space-y-5">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#112542] tracking-tight">
                {this.props.fallbackTitle || "Admin Panel Encountered an Issue"}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 leading-relaxed">
                A component error or outdated script chunk prevented this page from rendering smoothly.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-left">
                <p className="text-[11px] font-mono text-[#dc2626] break-all line-clamp-3">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                onClick={this.handleReset}
                size="sm"
                className="w-full sm:w-auto h-9 gap-1.5 text-xs bg-[#1856b8] hover:bg-[#124494] text-white shadow-2xs font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/dashboard")}
                className="w-full sm:w-auto h-9 gap-1.5 text-xs text-[#5a6b82] border-[#e2e8f0]"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
