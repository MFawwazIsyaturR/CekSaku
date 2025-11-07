import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Settings,
  LayoutGrid,
  TrendingUp,
  ReceiptText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutDialog from "./logout-dialog";

// 1. Definisikan item navigasi utama (dari Sidebar desktop Anda)
const navItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Laporan", href: "/reports", icon: TrendingUp },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

/**
 * Komponen Navbar Bawah Mobile
 * Ditampilkan di perangkat mobile (md:hidden) dan mengambang di bawah.
 */
const MobileBottomNavbar = () => {
  const location = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Fungsi untuk mengecek apakah link aktif (termasuk sub-route)
  const isActive = (href: string) => {
    if (href === "/settings") {
      return location.pathname.startsWith("/settings");
    }
    return location.pathname === href;
  };

  // Fungsi untuk memicu dialog konfirmasi logout
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  return (
    <>
      {/* Container wrapper 
        - Fixed di bawah, lebar penuh, z-50
        - Hanya tampil di mobile (md:hidden)
        - 'h-24' (6rem) untuk memberi ruang (padding) agar nav bisa mengambang
      */}
      <div className="fixed bottom-0 left-0 right-0 h-24 z-50 md:hidden pointer-events-none flex justify-center">
        
        {/* Navigasi mengambang */}
        <nav className="absolute bottom-4 w-[95vw] max-w-sm
                        bg-gray-900 dark:bg-gray-900 
                        border border-gray-700
                        rounded-2xl shadow-lg p-2
                        flex items-stretch justify-around rounded-full
                        pointer-events-auto h-20">
          
          {/* 1. Render 4 item navigasi utama */}
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-1/5 rounded-lg py-2 transition-all",
                isActive(item.href)
                  ? "text-blue-400" // Warna aktif
                  : "text-gray-400 hover:text-gray-200" // Warna non-aktif
              )}
            >
              {/* Indikator aktif (pill biru di atas) */}
              <div className={cn(
                "absolute -bottom-2 h-2 w-10 rounded-full transition-all",
                isActive(item.href) ? "bg-blue-400" : "bg-transparent"
              )}></div>
              
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* 2. Tombol Logout (Paling Kanan) */}
          <button
            onClick={handleLogoutClick}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-1/5 rounded-full py-2 transition-all",
              "bg-red-500 text-white hover:bg-red-800" // Sesuai permintaan: background merah
            )}
          >
            {/* Placeholder transparan agar alignment tetap sama */}
            <div className="absolute -top-2 h-1 w-10 bg-transparent"></div>
            
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Keluar</span>
          </button>
        </nav>
      </div>

      {/* 3. Dialog Konfirmasi Logout (tersembunyi) */}
      <LogoutDialog isOpen={isLogoutDialogOpen} setIsOpen={setIsLogoutDialogOpen} />
    </>
  );
};

export default MobileBottomNavbar;