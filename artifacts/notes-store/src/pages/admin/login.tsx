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
import { BookOpen, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

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
    loginMutation.mutate(
      {
        data: {
          username: values.username,
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
            toast({ title: "Authentication failed", description: "Invalid username or password.", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Login error", description: "Failed to authenticate. Please check your credentials.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md space-y-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5a6b82] hover:text-[#112542] transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Store</span>
        </Link>

        <Card className="border-[#e2e8f0] shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4 px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] mb-3 shadow-2xs">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold text-[#112542] tracking-tight">Admin Console</CardTitle>
            <CardDescription className="text-xs text-[#64748b] mt-1">
              Sign in with your administrative credentials to manage 2PUC Notes
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-[#334155]">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin"
                          autoComplete="username"
                          className="h-10 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
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
                      <FormLabel className="text-xs font-semibold text-[#334155]">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            autoComplete="current-password"
                            className="h-10 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] pr-10 focus-visible:border-[#1856b8]"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#112542]"
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
                  className="w-full h-10 text-xs sm:text-sm font-semibold rounded-lg bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none mt-2 transition-colors" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-[#94a3b8]">
          Protected administrative area &bull; 2nd PUC Notes
        </p>
      </div>
    </div>
  );
}
