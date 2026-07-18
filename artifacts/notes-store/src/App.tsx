import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/public-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AdminGuard } from "@/components/admin-guard";

// Public Pages
import Home from "@/pages/home";
import SectionPage from "@/pages/section";
import CardPage from "@/pages/card";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment-success";
import MyPurchases from "@/pages/my-purchases";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsAndConditions from "@/pages/terms-and-conditions";
import RefundPolicy from "@/pages/refund-policy";
import ContactUs from "@/pages/contact-us";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSections from "@/pages/admin/sections";
import AdminCards from "@/pages/admin/cards";
import AdminCardNew from "@/pages/admin/card-new";
import AdminCardEdit from "@/pages/admin/card-edit";
import AdminOrders from "@/pages/admin/orders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
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
      </AdminLayout>
    </AdminGuard>
  );
}

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/section/:id" component={SectionPage} />
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
    </PublicLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/*" component={AdminRoutes} />
      <Route path="/*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
