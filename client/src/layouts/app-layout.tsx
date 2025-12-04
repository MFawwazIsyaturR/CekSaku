import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MobileBottomNavbar from "@/components/navbar/MobileBottomNavbar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-color)] dark:bg-background">
      {/* Sidebar Container */}
      <aside
        className={cn(
          "hidden md:block sticky top-0 h-screen z-40 border-r bg-background",
          // Transisi lebar sidebar
          "transition-[width] duration-300 ease-in-out",
          "overflow-hidden", // Wajib ada agar konten tidak bocor saat mengecil
          isSidebarOpen ? "w-[280px]" : "w-[72px]"
        )}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 bg-gray-100/40 dark:bg-gray-900/50">
          <div className="p-4 md:p-6 lg:p-8 pb-28 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNavbar />
    </div>
  );
}

export default AppLayout;