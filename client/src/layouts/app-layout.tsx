import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen AppLayout
 * -------------------
 * Komponen ini berfungsi sebagai *layout utama* aplikasi setelah pengguna login.
 * Menyusun struktur halaman yang terdiri dari:
 * - Sidebar (navigasi utama)
 * - Navbar (header aplikasi)
 * - Outlet (konten halaman yang dinamis tergantung route)
 */
function AppLayout() {
  /**
   * State global layout untuk mengatur kondisi sidebar.
   * - `true`: sidebar terbuka (expanded)
   * - `false`: sidebar tertutup (collapsed)
   */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={cn(
        // Grid utama dengan dua kolom: sidebar + konten
        "grid min-h-screen w-full transition-all duration-300 ease-in-out",
        // Ubah lebar kolom sidebar secara responsif saat toggle aktif
        isSidebarOpen
          ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
          : "md:grid-cols-[72px_1fr]"
      )}
    >
      {/* ============================================
          =============== SIDEBAR AREA ===============
          ============================================
          Sidebar hanya ditampilkan di layar medium ke atas (md+).
          Status buka/tutup dikontrol oleh state isSidebarOpen.
      */}
     <div className="hidden border-r bg-background md:block relative z-40">
  <Sidebar isSidebarOpen={isSidebarOpen} />
</div>


      {/* ============================================
          =============== MAIN CONTENT ===============
          ============================================
          Bagian kanan layout berisi:
          - Navbar di bagian atas
          - Konten halaman (Outlet dari react-router)
      */}
      <div className="flex flex-col">
        {/* Navbar menerima state dan fungsi toggle sidebar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Outlet menampilkan komponen halaman sesuai rute aktif */}
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
