import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderTree, 
  Files, 
  ShoppingCart, 
  LogOut,
  Menu,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  PlusCircle,
  Users,
  DownloadCloud,
  Settings,
  Sparkles,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Traffic & Views", icon: BarChart3, badge: "Live" },
    ],
  },
  {
    title: "CONTENT & MATERIALS",
    items: [
      { href: "/admin/cards", label: "Study Resources", icon: Files },
      { href: "/admin/cards/new", label: "Add New Resource", icon: PlusCircle },
      { href: "/admin/sections", label: "Subjects & Categories", icon: FolderTree },
    ],
  },
  {
    title: "COMMERCE & AUDIT",
    items: [
      { href: "/admin/orders", label: "Orders & Payments", icon: ShoppingCart },
      { href: "/admin/customers", label: "Students Directory", icon: Users },
      { href: "/admin/downloads", label: "Downloads Audit", icon: DownloadCloud },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/admin/settings", label: "System Status", icon: Settings },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function preloadAdminRoute(href: string) {
  if (href === "/admin/dashboard") import("@/pages/admin/dashboard");
  else if (href === "/admin/analytics") import("@/pages/admin/analytics");
  else if (href === "/admin/cards") import("@/pages/admin/cards");
  else if (href === "/admin/cards/new") import("@/pages/admin/card-new");
  else if (href === "/admin/sections") import("@/pages/admin/sections");
  else if (href === "/admin/orders") import("@/pages/admin/orders");
  else if (href === "/admin/customers") import("@/pages/admin/customers");
  else if (href === "/admin/downloads") import("@/pages/admin/downloads");
  else if (href === "/admin/settings") import("@/pages/admin/settings");
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const logout = useAdminLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Warm up admin page chunks in background
    const timer = setTimeout(() => {
      import("@/pages/admin/dashboard");
      import("@/pages/admin/cards");
      import("@/pages/admin/sections");
      import("@/pages/admin/orders");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        import("@/lib/utils").then(({ clearAdminToken }) => {
          clearAdminToken();
          window.location.href = "/admin/login";
        });
      },
      onError: () => {
        import("@/lib/utils").then(({ clearAdminToken }) => {
          clearAdminToken();
          window.location.href = "/admin/login";
        });
      }
    });
  };

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
            {group.title}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isExactMatch = location === item.href;
            const isPrefixMatch = item.href !== "/admin/dashboard" && location.startsWith(item.href) && location !== "/admin/cards/new";
            const isActive = item.href === "/admin/cards/new" ? location === "/admin/cards/new" : isExactMatch || isPrefixMatch;

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={onItemClick} 
                onMouseEnter={() => preloadAdminRoute(item.href)}
              >
                <div
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] shadow-2xs font-semibold"
                      : "text-[#5a6b82] hover:text-[#112542] hover:bg-[#f1f5f9]/80 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-[#1856b8]" : "text-[#94a3b8] group-hover:text-[#5a6b82]"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#1856b8] shrink-0" />}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );

  // Derive current page title for topbar
  const currentNav = ALL_NAV_ITEMS.find((item) => 
    location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href))
  );
  const pageTitle = location.includes("/cards/new") 
    ? "Create Study Resource" 
    : location.includes("/edit") 
    ? "Edit Study Resource" 
    : currentNav?.label || "Admin Console";

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] shadow-2xs">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#112542] tracking-tight block">2PUC Admin</span>
            <span className="text-[10px] text-[#64748b] block font-medium">Dashboard Console</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#5a6b82] hover:text-[#1856b8] px-2.5 py-1.5 rounded-md hover:bg-[#f1f5f9] flex items-center gap-1 border border-[#e2e8f0]"
          >
            <span>Live Store</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a6b82]" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col justify-between border-r border-[#e2e8f0]">
              <div className="overflow-y-auto flex-1">
                <div className="p-4 border-b border-[#eef2f6] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#112542] tracking-tight block">2PUC Admin</span>
                      <span className="text-[11px] text-[#64748b] block">Management Panel</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    Live
                  </span>
                </div>
                <nav className="p-3">
                  <NavLinks onItemClick={() => setMobileOpen(false)} />
                </nav>
              </div>
              <div className="p-4 border-t border-[#eef2f6] space-y-2 bg-[#f8fafc]/80">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#5a6b82] hover:text-[#112542] rounded-lg bg-white border border-[#e2e8f0] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-[#1856b8]" />
                    Open Live Storefront
                  </span>
                  <ChevronRight className="h-3 w-3 text-[#94a3b8]" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 xl:w-70 flex-col border-r border-[#e2e8f0] bg-white h-[100dvh] sticky top-0 shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#eef2f6]">
          <Link href="/admin/dashboard" className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] shadow-2xs group-hover:bg-[#dce8fa] transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-base text-[#112542] tracking-tight leading-none block">
                  2PUC Admin
                </span>
                <span className="text-[11px] text-[#64748b] font-medium leading-none mt-1.5 block">
                  Store Management Console
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#ebf3ff] text-[#1856b8] px-2 py-0.5 rounded-full font-semibold border border-[#dce8fa]">
              v2.5
            </span>
          </Link>
        </div>

        {/* Live Storefront Quick Pill */}
        <div className="px-4 pt-3 pb-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#5a6b82] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ebf3ff] hover:text-[#1856b8] hover:border-[#dce8fa] transition-all group shadow-2xs"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              View Live Storefront
            </span>
            <ExternalLink className="h-3 w-3 text-[#94a3b8] group-hover:text-[#1856b8] shrink-0" />
          </a>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* Footer Admin Info & Logout */}
        <div className="p-3 border-t border-[#eef2f6] bg-[#f8fafc]/60">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e2e8f0] shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#112542] truncate">Authenticated Admin</p>
                <p className="text-[10px] text-emerald-600 font-medium truncate">HMAC Session Secure</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#64748b] hover:text-red-600 hover:bg-red-50 shrink-0"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[#e2e8f0] bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin/dashboard" className="text-[#64748b] hover:text-[#112542] transition-colors">
              Admin
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#cbd5e1]" />
            <span className="font-semibold text-[#112542]">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {location !== "/admin/cards/new" && (
              <Link href="/admin/cards/new">
                <Button size="sm" className="h-8 gap-1.5 text-xs bg-[#1856b8] hover:bg-[#124494] text-white shadow-2xs">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>New Resource</span>
                </Button>
              </Link>
            )}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#5a6b82] hover:text-[#1856b8] px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] flex items-center gap-1.5 transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
