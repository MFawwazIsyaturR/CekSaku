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

interface SidebarProps {
  isSidebarOpen: boolean;
}

const topLevelNavItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Laporan", href: "/reports", icon: TrendingUp },
];

const bottomNavItems = [
  { label: "Aset & Investasi", href: "/assets", icon: Briefcase },
  { label: "Penagihan", href: "/billing", icon: CreditCard },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

function Sidebar({ isSidebarOpen }: SidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

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
        // [LOGIKA POSISI]
        // Open: px-3 (standar)
        // Closed: px-[18px] (presisi tengah: (72px - 16px padding container - 20px icon) / 2 = 18px)
        isSidebarOpen ? "px-3" : "px-[18px]",
        isActive(href) && "bg-muted text-primary"
      )}
    >
      {/* Ikon */}
      <Icon className={cn("h-5 w-5 shrink-0 transition-all duration-300")} />

      {/* Teks dengan animasi Width & Opacity */}
      <span
        className={cn(
          "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "max-w-[200px] opacity-100 ml-3 translate-x-0"
            : "max-w-0 opacity-0 -translate-x-5"
        )}
      >
        {label}
      </span>

      {/* Tooltip sederhana saat sidebar tertutup */}
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
          // Padding logo disamakan logikanya agar sejajar dengan menu
          isSidebarOpen ? "px-6" : "px-[18px]"
        )}
      >
        <Logo showText={isSidebarOpen} color="foreground" />
      </div>

      {/* --- Menu Navigasi --- */}
      {/* Class scrollbar-hide ditambahkan untuk menyembunyikan scrollbar native */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="grid items-start px-2 gap-y-1">
          {topLevelNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {bottomNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      {/* --- Footer (Logout) --- */}
      <div className="p-2 mt-auto">
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="ghost"
          className={cn(
            "w-full transition-all duration-300 group flex items-center relative overflow-hidden",
            "text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-950/30",
            isSidebarOpen ? "px-3 justify-start" : "px-[18px] justify-start"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-all duration-300" />

          <span
            className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
              isSidebarOpen
                ? "max-w-[200px] opacity-100 ml-3 translate-x-0"
                : "max-w-0 opacity-0 -translate-x-5"
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
