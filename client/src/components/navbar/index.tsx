import { useState } from "react";
import { Home, ArrowRightLeft, FileText, Settings, X, MenuIcon, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Beranda", icon: Home },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transaksi", icon: ArrowRightLeft },
    { href: PROTECTED_ROUTES.REPORTS, label: "Laporan", icon: FileText },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Pengaturan", icon: Settings },
  ];

  return (
    <>
      {/* Tombol Titik Tiga (Desktop) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        onMouseEnter={() => setIsSidebarOpen(true)}
        className="hidden md:flex fixed top-12 left-10 p-4 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300"
      >
        <MenuIcon className="h-8 w-8 text-white" />
      </button>

      {/* Overlay Blur saat Sidebar terbuka */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "hidden md:flex fixed top-0 left-0 h-full w-64 flex-col bg-[var(--secondary-dark-color)] text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Navigasi Menu */}
        <nav className="flex-1 flex flex-col mt-6 gap-1 px-3 overflow-y-auto">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.href}
                to={route.href}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon className={cn("h-5 w-5", pathname === route.href && "text-blue-400")} />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profil User */}
        <div className="p-4 border-t border-white/10">
          <UserNav
            userName={user?.name || ""}
            profilePicture={user?.profilePicture || ""}
            onLogout={() => setIsLogoutDialogOpen(true)}
          />
        </div>
      </aside>

      {/* Navbar Bawah untuk Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--secondary-dark-color)] h-20 px-4 mb-6 py-2 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] rounded-t-full rounded-b-full mx-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          return (
            <NavLink
              key={route.href}
              to={route.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 w-full text-white/70 transition-colors duration-200",
                  isActive && "text-blue-400"
                )
              }
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          );
        })}

        {/* Tombol Logout (Mobile) */}
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className="flex flex-col items-center justify-center gap-1 w-full bg-red-500 text-white rounded-full p-2 transition-all duration-200 active:scale-95"
        >
          <LogOut className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </nav>

      {/* Dialog Logout */}
      <LogoutDialog isOpen={isLogoutDialogOpen} setIsOpen={setIsLogoutDialogOpen} />
    </>
  );
};

export default Navbar;
