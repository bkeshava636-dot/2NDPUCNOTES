import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AdminGuard } from "@/components/admin-guard";
import { ApiWakeUpGate } from "@/components/api-wake-up-gate";

import { lazy, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// Core Public Pages (bundled for fast student browsing)
import Home from "@/pages/home";
import SubjectPage from "@/pages/subject";
import CategoryPage from "@/pages/category";
import SectionPage from "@/pages/section";
import CardPage from "@/pages/card";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment-success";
import MyPurchases from "@/pages/my-purchases";

// Code-split Legal Pages
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("@/pages/terms-and-conditions"));
const RefundPolicy = lazy(() => import("@/pages/refund-policy"));
const ContactUs = lazy(() => import("@/pages/contact-us"));

// Code-split Admin Pages (keeps admin bundles separate from public store)
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminSections = lazy(() => import("@/pages/admin/sections"));
const AdminCards = lazy(() => import("@/pages/admin/cards"));
const AdminCardNew = lazy(() => import("@/pages/admin/card-new"));
const AdminCardEdit = lazy(() => import("@/pages/admin/card-edit"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50dvh] flex items-center justify-center p-8">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Switch>
            <Route path="/admin" component={() => <Redirect to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/sections" component={AdminSections} />
            <Route path="/admin/cards" component={AdminCards} />
            <Route path="/admin/cards/new" component={AdminCardNew} />
            <Route path="/admin/cards/:id/edit" component={AdminCardEdit} />
            <Route path="/admin/orders" component={AdminOrders} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </AdminLayout>
    </AdminGuard>
  );
}

function PublicRoutes() {
  return (
    <PublicLayout>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/subject/:slug" component={SubjectPage} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route path="/section/:id" component={SubjectPage} />
          <Route path="/card/:id" component={CardPage} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/my-purchases" component={MyPurchases} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsAndConditions} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/contact" component={ContactUs} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </PublicLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login">
        <Suspense fallback={<RouteLoadingFallback />}>
          <AdminLogin />
        </Suspense>
      </Route>
      <Route path="/admin/*" component={AdminRoutes} />
      <Route path="/*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ApiWakeUpGate>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </ApiWakeUpGate>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
