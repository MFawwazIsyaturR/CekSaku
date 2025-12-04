// client/src/layouts/app-layout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MobileBottomNavbar from "@/components/navbar/MobileBottomNavbar"; 

function AppLayout() {
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
      */}
     <div className="hidden border-r bg-background md:block sticky top-0 h-screen z-40">
      <Sidebar isSidebarOpen={isSidebarOpen} />
     </div>


      {/* ============================================
          =============== MAIN CONTENT ===============
          ============================================
      */}
      {/* PERBAIKAN: Tambahkan 'min-w-0' pada div ini.
        Ini adalah kolom grid utama untuk konten. 'min-w-0' akan
        memastikan bahwa jika konten di dalamnya (seperti tabel)
        terlalu lebar, konten itu akan dipaksa untuk scroll
        secara internal (karena tabel sudah punya 'overflow-x-auto')
        alih-alih merusak seluruh layout halaman.
      */}
      <div className="flex flex-col min-w-0"> 
        {/* Navbar menerima state dan fungsi toggle sidebar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Area <main> ini sekarang akan di-scroll secara vertikal
          dan dibatasi lebarnya oleh 'min-w-0' di atas.
        */}
        <main className="flex-1 overflow-y-auto bg-gray-100/40 dark:bg-gray-900/50">
          {/* Wrapper ini memberi padding konsisten */}
          <div className="p-4 md:p-6 lg:p-8 pb-28 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Navbar Bawah Mobile */}
      <MobileBottomNavbar />
    </div>
  );
}

export default AppLayout;