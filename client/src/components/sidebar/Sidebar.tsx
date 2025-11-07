import { Link, useLocation } from "react-router-dom";
import { Settings, LayoutGrid, TrendingUp, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";

/**
 * Props untuk komponen Sidebar.
 * - `isSidebarOpen`: menentukan apakah sidebar dalam kondisi terbuka (expanded)
 *   atau tertutup (collapsed).
 */
interface SidebarProps {
  isSidebarOpen: boolean;
}

/**
 * Daftar navigasi utama yang muncul di sidebar.
 * Setiap item memiliki label, tautan (href), dan ikon terkait.
 */
const navItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Laporan", href: "/reports", icon: TrendingUp },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

/**
 * Komponen Sidebar utama.
 * Menampilkan logo aplikasi dan daftar navigasi,
 * serta dapat bertransisi antara mode terbuka dan tertutup.
 */
function Sidebar({ isSidebarOpen }: SidebarProps) {
  // Hook bawaan react-router untuk mendapatkan lokasi URL aktif.
  // Digunakan untuk menentukan menu mana yang sedang aktif.
  const location = useLocation();

  // Fungsi pembantu untuk mengecek apakah path saat ini cocok dengan path menu.
  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      {/* ============================================
          ================ LOGO HEADER ===============
          ============================================
          Bagian atas sidebar berisi logo aplikasi.
          Logo dapat menampilkan teks atau hanya ikon tergantung status sidebar.
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
          Menampilkan daftar menu utama dengan ikon dan label.
          Label akan tersembunyi saat sidebar dalam keadaan tertutup.
      */}
      <div className="flex-1">
        <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                // Gaya dasar tombol menu
                "flex items-center gap-3 my-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                // Beri warna berbeda untuk halaman aktif
                isActive(item.href) && "bg-muted text-primary",
                // Saat sidebar tertutup, ikon di tengah dan label disembunyikan
                !isSidebarOpen && "justify-center"
              )}
            >
              {/* Ikon menu */}
              <item.icon className="h-4 w-4" />
              
              {/* Label menu — muncul hanya jika sidebar terbuka */}
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  !isSidebarOpen ? "w-0 opacity-0" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
