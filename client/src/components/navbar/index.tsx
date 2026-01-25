import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
// import { UserNav } from "./user-nav";
import Sidebar from "../sidebar/Sidebar"; // <-- Import ini sudah tidak terpakai
import { cn } from "@/lib/utils";

/**
 * ... (Interface NavbarProps)
 */
interface NavbarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

/**
 * ... (Deskripsi Komponen Navbar)
 */
function Navbar({ isSidebarOpen = false, setIsSidebarOpen }: NavbarProps) {
  const hasSidebarToggle = !!setIsSidebarOpen;

  return (
    <header className="flex h-8 items-center px-4 lg:h-[60px] lg:px-6">

      {/* ============================================
          ============ TOGGLE SIDEBAR MOBILE =========
          ============================================
          Blok <Sheet>...</Sheet> ini dihapus seluruhnya 
          karena perannya digantikan oleh MobileBottomNavbar.
      */}

      {/* BLOK YANG DIHAPUS:
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
        <SheetContent side="left" className="flex flex-col p-0">
          <Sidebar isSidebarOpen={true} />
        </SheetContent>
      </Sheet> 
      */}

      {/* ============================================
          =========== TOGGLE SIDEBAR DESKTOP =========
          ============================================
          (Kode ini tidak berubah, tetap ada untuk desktop)
      */}
      {hasSidebarToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}

      {/* ============================================
          ================ USER NAV ==================
          ============================================
      */}
      {/* <UserNav /> */}
    </header>
  );
}

export default Navbar;