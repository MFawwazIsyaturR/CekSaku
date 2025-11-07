import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserNav } from "./user-nav";
import Sidebar from "../sidebar/Sidebar";
import { cn } from "@/lib/utils";

/**
 * Tipe props untuk komponen Navbar.
 * - `isSidebarOpen`: menentukan apakah sidebar dalam kondisi terbuka.
 * - `setIsSidebarOpen`: fungsi untuk mengubah status sidebar (open/close).
 *   Bersifat opsional agar komponen ini bisa digunakan di berbagai konteks.
 */
interface NavbarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

/**
 * Komponen Navbar utama.
 * Menangani tampilan header aplikasi, termasuk tombol untuk membuka sidebar
 * pada mode mobile maupun desktop.
 */
function Navbar({ isSidebarOpen = false, setIsSidebarOpen }: NavbarProps) {
  // Cek apakah Navbar memiliki akses ke fungsi toggle sidebar
  // Jika tidak, tombol toggle sidebar di desktop tidak akan ditampilkan.
  const hasSidebarToggle = !!setIsSidebarOpen;

  return (
    <header className="flex h-8 items-center px-4 lg:h-[60px] lg:px-6">
      
      {/* ============================================
          ============ TOGGLE SIDEBAR MOBILE =========
          ============================================
          Tombol hamburger hanya muncul di layar kecil (mobile).
          Saat ditekan, membuka Sheet berisi komponen Sidebar penuh.
      */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        {/* Konten Sidebar yang muncul di sisi kiri layar */}
        <SheetContent side="left" className="flex flex-col p-0">
          <Sidebar isSidebarOpen={true} />
        </SheetContent>
      </Sheet>

      {/* ============================================
          =========== TOGGLE SIDEBAR DESKTOP =========
          ============================================
          Tombol toggle sidebar hanya muncul di layar besar (desktop).
          Dapat menutup atau membuka sidebar melalui state global/layout.
      */}
      {hasSidebarToggle && (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "hidden md:flex h-10 w-10 items-center justify-center relative z-50 cursor-pointer",
      // Pastikan padding atau margin agar ikon tidak terlalu ke pinggir
      "ml-2",  
      // (opsional) hover style
      "hover:bg-accent hover:text-accent-foreground"
    )}
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  >
    <Menu className="h-14 w-14 pointer-events-none" />
    <span className="sr-only">Toggle Sidebar</span>
  </Button>
)}


      {/* ============================================
          ================ USER NAV ==================
          ============================================
          Komponen navigasi pengguna (profil, logout, dll)
          Bisa diaktifkan kembali jika sudah diimplementasikan.
      */}
      {/* <UserNav /> */}
    </header>
  );
}

export default Navbar;
