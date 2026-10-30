import { MetaNoIndex } from "@/components/meta-noindex";
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin, useAdminMe, getAdminMeQueryKey } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const { data: adminMe } = useAdminMe({
    query: {
      queryKey: getAdminMeQueryKey(),
      enabled: Boolean(token),
    },
  });
  const loginMutation = useAdminLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (token && adminMe?.isAdmin) {
    setLocation("/admin/dashboard");
    return null;
  }

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setAuthError(null);
    loginMutation.mutate(
      {
        data: {
          username: values.username.trim(),
          password: values.password,
        },
      },
      {
        onSuccess: (data) => {
          if (data.success && data.token) {
            import("@/lib/utils").then(({ setAdminToken }) => {
              setAdminToken(data.token!);
              window.location.href = "/admin/dashboard";
            });
          } else {
            setAuthError("Invalid username or password. Please try again.");
            toast({ title: "Authentication failed", description: "Invalid username or password.", variant: "destructive" });
          }
        },
        onError: (err: any) => {
          const msg = err?.message || "Failed to authenticate. Please check your credentials.";
          setAuthError(msg);
          toast({ title: "Login error", description: msg, variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#0B0F19] text-[#0f172a] dark:text-[#F1F5F9] p-4 sm:p-6 relative transition-colors">
      <MetaNoIndex />

      {/* Top Bar with Back Link and Theme Toggle */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a6b82] dark:text-[#A1AEC2] hover:text-[#1856b8] dark:hover:text-[#818CF8] bg-white dark:bg-[#151D2E] px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-[#293548] transition-colors shadow-2xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Storefront</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4 my-auto">
        {/* Branding */}
        <div className="text-center space-y-1 mb-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ebf3ff] dark:bg-[#1C2638] text-[#1856b8] dark:text-[#818CF8] border border-[#dce8fa] dark:border-[#293548] mb-3 shadow-2xs">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
            <span className="text-[#1856b8] dark:text-[#818CF8]">2</span>PUC <span className="font-bold text-lg text-[#64748b] dark:text-[#A1AEC2]">Admin</span>
          </h1>
          <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
            Sign in with administrative credentials to manage store resources
          </p>
        </div>

        {/* Centered Login Card */}
        <Card className="border-[#e2e8f0] dark:border-[#293548] shadow-sm rounded-2xl bg-white dark:bg-[#151D2E] overflow-hidden">
          <CardHeader className="pt-6 pb-2 px-6 border-b border-[#f1f5f9] dark:border-[#293548]">
            <CardTitle className="text-base font-bold text-[#112542] dark:text-[#F1F5F9] flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#1856b8] dark:text-[#818CF8]" />
              <span>Admin Authentication</span>
            </CardTitle>
            <CardDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              Protected dashboard access for 2nd PUC Notes
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-[#334155] dark:text-[#F1F5F9]">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter admin username"
                          autoComplete="username"
                          disabled={loginMutation.isPending}
                          className="h-10 text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#112542] dark:text-[#F1F5F9] placeholder:text-[#94a3b8] dark:placeholder:text-[#8291A8] focus-visible:border-[#1856b8] dark:focus-visible:border-[#818CF8]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-[#334155] dark:text-[#F1F5F9]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            autoComplete="current-password"
                            disabled={loginMutation.isPending}
                            className="h-10 text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#112542] dark:text-[#F1F5F9] placeholder:text-[#94a3b8] dark:placeholder:text-[#8291A8] pr-10 focus-visible:border-[#1856b8] dark:focus-visible:border-[#818CF8]"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-[#8291A8] hover:text-[#112542] dark:hover:text-[#F1F5F9] p-1"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-10 text-xs sm:text-sm font-semibold rounded-lg bg-[#1856b8] hover:bg-[#124494] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white dark:text-[#0B0F19] dark:font-bold shadow-none mt-2 transition-colors" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </span>
                  ) : (
                    "Sign In to Control Console"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-[#94a3b8] dark:text-[#8291A8] flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Protected administrative area &bull; 2PUC</span>
          </p>
        </div>
      </div>
    </div>
  );
}
