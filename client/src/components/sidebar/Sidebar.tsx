// client/src/components/sidebar/Sidebar.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "@/components/logo/logo";
import { PROTECTED_ROUTES, AUTH_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(AUTH_ROUTES.SIGN_IN);
    setIsLogoutAlertOpen(false);
  };

  const sidebarNavItems = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Beranda", icon: LayoutDashboard },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transaksi", icon: ArrowRightLeft },
    { href: PROTECTED_ROUTES.REPORTS, label: "Laporan", icon: PieChart }, 
    { href: PROTECTED_ROUTES.SETTINGS, label: "Pengaturan", icon: Settings }, 
  ];

  return (
    <>
      {/* --- Desktop Sidebar (No changes here) --- */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo Header */}
       <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700 mt-4">
           {/* **Perbaikan:** Setel warna Logo secara eksplisit */}
           {/* Jika mode terang, pakai hitam, jika gelap, pakai putih */}
           {/* Kita bisa menggunakan ThemeContext di sini, atau cara sederhana: */}
           <div className="dark:hidden"> {/* Tampilkan ini hanya di mode terang */}
                <Logo color="black" />
           </div>
           <div className="hidden dark:block"> {/* Tampilkan ini hanya di mode gelap */}
                <Logo color="white" />
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-4 space-y-1 mt-12">
          {sidebarNavItems.map((item) => {
             const isPlaceholder = !Object.values(PROTECTED_ROUTES).includes(item.href);
             if (isPlaceholder && item.label !== "Budgets") return null;
             const targetPath = item.label === "Profile" ? PROTECTED_ROUTES.SETTINGS : item.href;

             return (
               <NavLink
                 key={item.href}
                 to={targetPath}
                 end
                 className={({ isActive }) =>
                   cn(
                     "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150",
                     isActive
                       ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                       : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                   )
                 }
               >
                 <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                 {item.label}
               </NavLink>
            );
           })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
           <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
             <AlertDialogTrigger asChild>
                <Button 
  variant="ghost" 
  className="w-full justify-start text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-500"
>
  <LogOut className="mr-3 h-5 w-5 text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-500" aria-hidden="true" />
  Keluar
</Button>

            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin ingin keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan kembali ke halaman login.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* --- Mobile Bottom Nav (Apply floating styles here) --- */}
       <nav className={cn(
           "md:hidden fixed bottom-0 left-0 right-0 z-50", // Base  positioning
           "mx-4 mb-6",                                     // Margins for floating effect
           "h-16",                                         // Height
           "bg-white dark:bg-gray-800",                    // Background colors
           "rounded-full",                                 // Rounded pill shape
           "shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]", // Shadow
           "flex justify-around items-center"              // Flex layout
        )}
       >
           {sidebarNavItems.map((item) => {
             const isPlaceholder = !Object.values(PROTECTED_ROUTES).includes(item.href);
             if (isPlaceholder && item.label !== "Budgets") return null;
             const targetPath = item.label === "Profile" ? PROTECTED_ROUTES.SETTINGS : item.href;

             return (
               <NavLink
                 key={item.href}
                 to={targetPath}
                 end
                 className={({ isActive }) =>
                   cn(
                     "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-150 rounded-full", // Added rounded-full here for potential hover effects inside
                     isActive
                       ? "text-blue-600 dark:text-blue-300"
                       : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                   )
                 }
               >
                 <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
                 {item.label}
               </NavLink>
             );
           })}
           {/* Logout Button (Triggering the same Dialog) */}
           <button
             onClick={() => setIsLogoutAlertOpen(true)} // Still triggers the dialog
             className="flex flex-col items-center justify-center w-full h-full text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full" // Added rounded-full
           >
             <LogOut className="h-5 w-5 mb-1" aria-hidden="true" />
             Logout
           </button>
       </nav>
       {/* --- The Logout Dialog remains outside the nav --- */}
       <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
            {/* ... AlertDialogContent ... */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin ingin keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan kembali ke halaman login.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                  Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </>
  );
};

export default Sidebar;