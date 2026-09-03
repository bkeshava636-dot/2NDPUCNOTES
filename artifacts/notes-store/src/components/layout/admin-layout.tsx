import { ReactNode } from "react";
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
  ShieldCheck
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cards", label: "Resources", icon: Files },
  { href: "/admin/sections", label: "Sections", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const logout = useAdminLogout();

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
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} onClick={onItemClick}>
            <div
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] shadow-2xs font-semibold"
                  : "text-[#5a6b82] hover:text-[#112542] hover:bg-[#f8fafc]"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#1856b8]" : "text-[#94a3b8]"}`} />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  // Derive current page title for topbar
  const currentNav = NAV_ITEMS.find(item => 
    location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href))
  );
  const pageTitle = location.includes("/cards/new") 
    ? "New Resource" 
    : location.includes("/edit") 
    ? "Edit Resource" 
    : currentNav?.label || "Admin";

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0] bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-bold text-base text-[#112542] tracking-tight">2PUC Admin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#5a6b82] hover:text-[#1856b8] px-2.5 py-1.5 rounded-md hover:bg-[#f1f5f9] flex items-center gap-1"
          >
            <span>Store</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5a6b82]" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col justify-between border-r border-[#e2e8f0]">
              <div>
                <div className="p-5 border-b border-[#eef2f6] flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-[#112542] tracking-tight block">2PUC Admin</span>
                    <span className="text-[11px] text-[#64748b] block">Management Panel</span>
                  </div>
                </div>
                <nav className="p-3">
                  <NavLinks />
                </nav>
              </div>
              <div className="p-4 border-t border-[#eef2f6] space-y-2 bg-[#f8fafc]/60">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#5a6b82] hover:text-[#112542] rounded-lg hover:bg-white border border-transparent hover:border-[#e2e8f0] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-[#94a3b8]" />
                    Live Storefront
                  </span>
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
      <aside className="hidden md:flex w-60 xl:w-64 flex-col border-r border-[#e2e8f0] bg-white h-[100dvh] sticky top-0 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#eef2f6]">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] shadow-2xs group-hover:bg-[#dce8fa] transition-colors">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-base text-[#112542] tracking-tight leading-none block">
                2PUC Admin
              </span>
              <span className="text-[11px] text-[#64748b] font-medium leading-none mt-1 block">
                Store Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Live Store Quick Link Pill */}
        <div className="px-4 pt-4 pb-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-[#5a6b82] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ebf3ff] hover:text-[#1856b8] hover:border-[#dce8fa] transition-all group"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              View Live Store
            </span>
            <ExternalLink className="h-3 w-3 text-[#94a3b8] group-hover:text-[#1856b8] shrink-0" />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
            Management
          </p>
          <NavLinks />
        </nav>

        {/* Admin Footer & Logout */}
        <div className="p-3 border-t border-[#eef2f6] bg-[#f8fafc]/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e2e8f0]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-[#ebf3ff] border border-[#dce8fa] flex items-center justify-center text-[#1856b8] shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#112542] truncate">Store Admin</p>
                <p className="text-[10px] text-[#64748b] truncate">Session Active</p>
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
        {/* Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[#e2e8f0] bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#64748b]">Admin</span>
            <span className="text-[#cbd5e1]">/</span>
            <span className="font-semibold text-[#112542]">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#5a6b82] hover:text-[#1856b8] px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] flex items-center gap-1.5 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
