import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ReceiptText,
  TrendingUp,
  Briefcase,
  Menu,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Separator } from "@/components/ui/separator";

const primaryNavItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Aset", href: "/assets", icon: Briefcase },
  { label: "Laporan", href: "/reports", icon: TrendingUp },
];

const MobileBottomNavbar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) => {
     if (href === "/settings") return location.pathname.startsWith("/settings");
     return location.pathname === href;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(AUTH_ROUTES.LANDING);
  };

  const handleNavClick = () => {
     setIsDrawerOpen(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none flex justify-center pb-6 pt-4 ">
      
      <nav className={cn(
        "pointer-events-auto",
        "w-[92vw] max-w-sm",
        "bg-background/80 backdrop-blur-xl border border-border/50",
        "rounded-2xl shadow-2xl shadow-black/5",
        "flex items-center justify-between px-2 py-2 h-[72px]"
      )}>
        
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 flex-1 h-full rounded-xl transition-all duration-200",
              "active:scale-95 touch-manipulation",
              isActive(item.href)
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive(item.href) && (
               <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
            
            <item.icon className={cn("h-5 w-5", isActive(item.href) && "fill-primary/10")} />
            <span className="text-[10px] leading-none">{item.label}</span>
          </NavLink>
        ))}

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 flex-1 h-full rounded-xl transition-all duration-200 active:scale-95",
                isDrawerOpen ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] leading-none">Menu</span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="max-h-[80vh]">
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader className="flex justify-between items-center pb-2">
                <DrawerTitle>Menu Lainnya</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Pengaturan</h4>
                  
                  <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start gap-3 h-12 text-base font-normal",
                        isActive("/settings") && "border-primary bg-primary/5"
                    )}
                    onClick={() => {
                        navigate("/settings");
                        handleNavClick();
                    }}
                  >
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <Settings className="h-4 w-4" />
                    </div>
                    Pengaturan
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                                     <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start gap-3 h-12 text-base font-medium transition-colors",
                        "text-red-500 dark:text-red-400", // Warna teks utama
                        "hover:text-red-600 dark:hover:text-red-300", // Warna saat hover
                        "hover:bg-red-50 dark:hover:bg-red-950/30" // Background tipis saat hover
                      )}
                      onClick={handleLogout}
                   >
                      <LogOut className="h-5 w-5 shrink-0" />
                      Keluar
                   </Button>
                </div>
              </div>
              
              <div className="p-4 text-center">
                 <p className="text-[10px] text-muted-foreground">
                    CekSaku v0.1
                 </p>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

      </nav>
    </div>
  );
};

export default MobileBottomNavbar;