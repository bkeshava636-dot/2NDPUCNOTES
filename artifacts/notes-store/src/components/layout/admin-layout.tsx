import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FolderTree, 
  Files, 
  ShoppingCart, 
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sections", label: "Sections", icon: FolderTree },
  { href: "/admin/cards", label: "Cards", icon: Files },
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

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href || location.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 ${isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-40">
        <span className="font-bold text-lg text-primary">Admin Panel</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 flex flex-col gap-4">
            <span className="font-bold text-lg text-primary px-4">Admin Panel</span>
            <nav className="flex flex-col gap-2 mt-4">
              <NavLinks />
            </nav>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white h-[100dvh] sticky top-0">
        <div className="p-6 border-b">
          <span className="font-bold text-xl text-primary flex items-center gap-2">
            2PUC Admin
          </span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLinks />
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
