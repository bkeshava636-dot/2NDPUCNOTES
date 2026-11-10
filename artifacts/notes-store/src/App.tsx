import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AdminGuard } from "@/components/admin-guard";
import { AdminErrorBoundary } from "@/components/admin-error-boundary";
import { ApiWakeUpGate } from "@/components/api-wake-up-gate";
import { KcetLayout } from "@/components/kcet/kcet-layout";

import { lazy, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// Core Public SEO Pages (Eagerly loaded so Googlebot renders full content without Suspense spinner)
import Home from "@/pages/home";
import SubjectPage from "@/pages/subject";
import CategoryPage from "@/pages/category";
import CardPage from "@/pages/card";
import AboutUs from "@/pages/about";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsAndConditions from "@/pages/terms-and-conditions";
import RefundPolicy from "@/pages/refund-policy";
import ContactUs from "@/pages/contact-us";
import ContributePage from "@/pages/contribute";

// Transactional Pages (Code-split & NoIndex)
const Checkout = lazy(() => import("@/pages/checkout"));
const PaymentSuccess = lazy(() => import("@/pages/payment-success"));
const MyPurchases = lazy(() => import("@/pages/my-purchases"));

// Code-split Admin Pages (keeps admin bundles separate from public store)
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminSections = lazy(() => import("@/pages/admin/sections"));
const AdminCards = lazy(() => import("@/pages/admin/cards"));
const AdminCardNew = lazy(() => import("@/pages/admin/card-new"));
const AdminCardEdit = lazy(() => import("@/pages/admin/card-edit"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminCustomers = lazy(() => import("@/pages/admin/customers"));
const AdminDownloads = lazy(() => import("@/pages/admin/downloads"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics"));
const AdminFeedback = lazy(() => import("@/pages/admin/feedback"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));

// Core KCET SEO Pages (Eagerly loaded so Googlebot renders full content cleanly)
import KcetHome from "@/pages/kcet/kcet-home";
import KcetCategoryPage from "@/pages/kcet/kcet-category";
import KcetSubjectPage from "@/pages/kcet/kcet-subject";

// Code-split KCET Contribute & Admin Pages (strictly isolated from 2nd PUC)
const KcetContribute = lazy(() => import("@/pages/kcet/kcet-contribute"));
const KcetAdminDashboard = lazy(() => import("@/pages/admin/kcet/kcet-admin-dashboard"));
const KcetAdminMaterials = lazy(() => import("@/pages/admin/kcet/kcet-admin-materials"));
const KcetAdminMaterialForm = lazy(() => import("@/pages/admin/kcet/kcet-admin-material-form"));
const KcetAdminTaxonomy = lazy(() => import("@/pages/admin/kcet/kcet-admin-taxonomy"));
const KcetAdminContributions = lazy(() => import("@/pages/admin/kcet/kcet-admin-contributions"));
const KcetAdminAnalytics = lazy(() => import("@/pages/admin/kcet/kcet-admin-analytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes — keeps data instantly available without re-fetching
      gcTime: 30 * 60 * 1000,   // 30 minutes cache retention
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
    <AdminLayout>
      <AdminErrorBoundary>
        <AdminGuard>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Switch>
              <Route path="/admin" component={() => <Redirect to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/sections" component={AdminSections} />
              <Route path="/admin/cards" component={AdminCards} />
              <Route path="/admin/cards/new" component={AdminCardNew} />
              <Route path="/admin/cards/:id/edit" component={AdminCardEdit} />
              <Route path="/admin/orders" component={AdminOrders} />
              <Route path="/admin/customers" component={AdminCustomers} />
              <Route path="/admin/downloads" component={AdminDownloads} />
              <Route path="/admin/analytics" component={AdminAnalytics} />
              <Route path="/admin/feedback" component={AdminFeedback} />
              <Route path="/admin/settings" component={AdminSettings} />
              {/* Isolated KCET Admin Routes (Shared Auth) */}
              <Route path="/admin/kcet" component={KcetAdminDashboard} />
              <Route path="/admin/kcet/materials" component={KcetAdminMaterials} />
              <Route path="/admin/kcet/materials/new" component={KcetAdminMaterialForm} />
              <Route path="/admin/kcet/materials/:id/edit" component={KcetAdminMaterialForm} />
              <Route path="/admin/kcet/taxonomy" component={KcetAdminTaxonomy} />
              <Route path="/admin/kcet/contributions" component={KcetAdminContributions} />
              <Route path="/admin/kcet/analytics" component={KcetAdminAnalytics} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </AdminGuard>
      </AdminErrorBoundary>
    </AdminLayout>
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
          <Route path="/about" component={AboutUs} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsAndConditions} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/contact" component={ContactUs} />
          <Route path="/contact-us" component={() => <Redirect to="/contact" />} />
          <Route path="/login" component={() => <Redirect to="/admin/login" />} />
          <Route path="/register" component={() => <Redirect to="/admin/login" />} />
          <Route path="/contribute" component={ContributePage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </PublicLayout>
  );
}

function KcetRoutes() {
  return (
    <KcetLayout>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Switch>
          <Route path="/kcet" component={KcetHome} />
          <Route path="/kcet/subject/:slug" component={KcetSubjectPage} />
          <Route path="/kcet/category/:slug" component={KcetCategoryPage} />
          <Route path="/kcet/contribute" component={KcetContribute} />
          <Route component={KcetHome} />
        </Switch>
      </Suspense>
    </KcetLayout>
  );
}

function RootOrPublicRoutes() {
  const { isKcet } = useAppMode();
  return (
    <Switch>
      <Route path="/">
        {isKcet ? (
          <KcetLayout>
            <Suspense fallback={<RouteLoadingFallback />}>
              <KcetHome />
            </Suspense>
          </KcetLayout>
        ) : (
          <PublicRoutes />
        )}
      </Route>
      <Route component={PublicRoutes} />
    </Switch>
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
      <Route path="/kcet" component={KcetRoutes} />
      <Route path="/kcet/*" component={KcetRoutes} />
      <Route path="/*" component={RootOrPublicRoutes} />
    </Switch>
  );
}

import { LanguageProvider } from "@/lib/language-context";
import { SitePassProvider } from "@/lib/site-pass-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AppModeProvider, useAppMode } from "@/lib/app-mode-context";
import { ModeTransitionOverlay } from "@/components/mode-transition-overlay";
import { AdSenseController } from "@/components/adsense-controller";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <SitePassProvider>
              <AppModeProvider>
                <ApiWakeUpGate>
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <AdSenseController />
                    <Router />
                    <ModeTransitionOverlay />
                  </WouterRouter>
                  <Toaster />
                </ApiWakeUpGate>
              </AppModeProvider>
            </SitePassProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
