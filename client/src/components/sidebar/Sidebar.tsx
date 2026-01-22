import { Link, useLocation } from "react-router-dom";

import {
  Settings,
  LayoutGrid,
  TrendingUp,
  ReceiptText,
  Briefcase,
  CreditCard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutDialog from "../navbar/logout-dialog";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  isAdmin?: boolean;
  items?: NavItem[];
}

const topLevelNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Laporan", href: "/reports", icon: TrendingUp },
];

const bottomNavItems = [
  { label: "Aset & Investasi", href: "/assets", icon: Briefcase },
  { label: "Penagihan", href: "/billing", icon: CreditCard },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

function Sidebar({ isSidebarOpen, isAdmin = false, items }: SidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const NavLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <Link
      to={href}
      className={cn(
        "group flex items-center rounded-lg py-3 text-muted-foreground transition-all duration-300 hover:text-primary relative overflow-hidden",
        "px-3",
        isActive(href) && "bg-muted text-primary"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 transition-all duration-300")} />

      <span
        className={cn(
          "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ml-3",
          isSidebarOpen
            ? "max-w-[200px] opacity-100"
            : "max-w-0 opacity-0"
        )}
      >
        {label}
      </span>

      {/* Tooltip saat sidebar tertutup */}
      {!isSidebarOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border">
          {label}
        </div>
      )}
    </Link>
  );

  return (
    <div className="flex h-full flex-col gap-2 py-2">
      {/* --- Header Logo --- */}
      <div
        className={cn(
          "flex h-14 items-center transition-all duration-300 lg:h-[60px]",
          "px-6"
        )}
      >
        <Logo showText={isSidebarOpen} color="foreground" />
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div
          className={cn(
            "mx-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20",
            !isSidebarOpen && "px-2"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span
              className={cn(
                "text-xs font-semibold text-violet-600 dark:text-violet-400 transition-all duration-300",
                !isSidebarOpen && "hidden"
              )}
            >
              Admin Panel
            </span>
          </div>
        </div>
      )}

      {/* --- Menu Navigasi --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="grid items-start px-2 gap-y-1 mt-2">
          {items ? (
            items.map((item) => (
              <NavLink key={item.href} {...item} />
            ))
          ) : (
            <>
              {topLevelNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}

              {bottomNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </>
          )}
        </nav>
      </div>

      {/* --- Footer (Logout) --- */}
      <div className="p-2 mt-auto">
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-300 group flex items-center relative overflow-hidden",
            "text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300",
            "hover:bg-red-50 dark:hover:bg-red-950/30",
            "px-3"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-all duration-300" />

          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ml-3",
              isSidebarOpen
                ? "max-w-[200px] opacity-100"
                : "max-w-0 opacity-0"
            )}
          >
            Keluar
          </span>
        </Button>
      </div>

      <LogoutDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  );
}

export default Sidebar;