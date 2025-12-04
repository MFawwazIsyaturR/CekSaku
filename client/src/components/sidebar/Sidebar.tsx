import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  LayoutGrid,
  TrendingUp,
  ReceiptText,
  Briefcase, // Ikon untuk "Aset & Investasi"
  CreditCard, // Ikon untuk "Penagihan"
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutDialog from "../navbar/logout-dialog";

/**
 * Props untuk komponen Sidebar.
 * - `isSidebarOpen`: menentukan apakah sidebar dalam kondisi terbuka (expanded)
 * atau tertutup (collapsed).
 */
interface SidebarProps {
  isSidebarOpen: boolean;
}

// --- Struktur Navigasi Baru (Disederhanakan) ---

// 1. Item Navigasi Tingkat Atas
// "Laporan" dipindahkan ke sini karena grup "Analisis" dihapus
const topLevelNavItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Laporan", href: "/reports", icon: TrendingUp }, 
];

// 2. Item Navigasi Bawah
const bottomNavItems = [
  { label: "Aset & Investasi", href: "/assets", icon: Briefcase },
  { label: "Penagihan", href: "/billing", icon: CreditCard },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

/**
 * Komponen Sidebar utama.
 * Menampilkan logo aplikasi dan daftar navigasi,
 * serta dapat bertransisi antara mode terbuka dan tertutup.
 */
function Sidebar({ isSidebarOpen }: SidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  // Fungsi pembantu untuk mengecek apakah path saat ini cocok
  const isActive = (href: string) => location.pathname.startsWith(href);

  const NavLink = ({
    href,
    icon: Icon,
    label,
    className: additionalClassName = "",
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    className?: string;
  }) => (
    <Link
      to={href}
      className={cn(
        // Gaya dasar:
        "flex items-center rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",

        // Beri warna berbeda untuk halaman aktif
        isActive(href) && "bg-muted text-primary",

        // Logika untuk alignment & gap
        !isSidebarOpen
          ? "justify-center" // Saat tertutup: HANYA justify-center.
          : "gap-3", // Saat terbuka: BARU tambahkan 'gap-3'.

        // Tambahkan className tambahan jika ada
        additionalClassName
      )}
    >
      <Icon className="h-5 w-5" />

      <span
        className={cn(
          "whitespace-nowrap transition-opacity duration-200",
          // 'hidden' akan menghapus span dari DOM flow.
          !isSidebarOpen ? "opacity-0 hidden" : "opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      {/* ============================================
                ======== LOGO HEADER ===============
                ============================================
      */}
      <div
        className={cn(
          "flex h-14 items-center px-4 transition-all duration-300 lg:h-[60px]",
          isSidebarOpen ? "lg:px-6" : "lg:px-5"
        )}
      >
        <Logo
          showText={isSidebarOpen}
          className={cn(!isSidebarOpen && "w-full justify-center")}
          color="foreground"
        />
      </div>

      {/* ============================================
                ============== NAVIGASI MENU ===============
                ============================================
      */}
      <div className="flex-1 overflow-y-auto">
        {/* Tambahkan 'gap-y-1' untuk memberi jarak vertikal antar item */}
        <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4 gap-y-1">
          {/* 1. Render Item Tingkat Atas */}
          {topLevelNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* 2. Render Item Bawah */}
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* Logout Button */}
          <LogoutButton
            isSidebarOpen={isSidebarOpen}
            onClick={() => setIsDialogOpen(true)}
          />
        </nav>
      </div>
      <LogoutDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  );
}

// Logout Button Component
const LogoutButton = ({ isSidebarOpen, onClick }: { isSidebarOpen: boolean; onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        " mt-70 items-center w-full text-red-400 hover:text-white rounded-lg px-3 py-3 transition-all",
        !isSidebarOpen ? "justify-center" : "gap-3",
        "bg-red-500 hover:bg-red-600 text-white"
      )}
    >
      <LogOut className={cn(isSidebarOpen ? "h-5 w-5" : "h-5 w-5")} />
      {isSidebarOpen && <span className="whitespace-nowrap">Keluar</span>}
    </Button>
  );
};

export default Sidebar;