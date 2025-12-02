import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  LayoutGrid,
  TrendingUp,
  ReceiptText,
  ClipboardList, // Ikon untuk "Perencanaan"
  Target, // Ikon untuk "Anggaran"
  Goal, // Ikon untuk "Tujuan"
  Landmark, // Ikon untuk "Utang"
  PieChart, // Ikon untuk "Analisis"
  BarChart, // Ikon untuk "Analitik"
  Briefcase, // Ikon untuk "Aset & Investasi"
  CreditCard, // Ikon untuk "Penagihan"
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Mengimpor komponen Accordion
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutDialog from "../navbar/logout-dialog";

/**
 * Props untuk komponen Sidebar.
 * - `isSidebarOpen`: menentukan apakah sidebar dalam kondisi terbuka (expanded)
 * atau tertutup (collapsed).
 */
interface SidebarProps {
  isSidebarOpen: boolean;
}

// --- Struktur Navigasi Baru ---

// 1. Item Navigasi Tingkat Atas (Selalu Terlihat)
const topLevelNavItems = [
  { label: "Dashboard", href: "/overview", icon: LayoutGrid },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
];

// 2. Item untuk Kategori "Perencanaan"
const planningItems = [
  { label: "Anggaran", href: "/budget", icon: Target }, // Rute baru (contoh)
  { label: "Tujuan", href: "/goals", icon: Goal }, // Rute baru (contoh)
  { label: "Utang", href: "/debt", icon: Landmark }, // Rute baru (contoh)
];

// 3. Item untuk Kategori "Analisis"
const analysisItems = [
  { label: "Analitik", href: "/analytics", icon: BarChart }, // Rute baru (contoh)
  { label: "Laporan", href: "/reports", icon: TrendingUp },
];

// 4. Item Navigasi Bawah (Setelah Kategori)
const bottomNavItems = [
  { label: "Aset & Investasi", href: "/assets", icon: Briefcase }, // Rute baru (contoh)
  { label: "Penagihan", href: "/billing", icon: CreditCard },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];
// --- Akhir Struktur Navigasi Baru ---

/**
 * Komponen Sidebar utama.
 * Menampilkan logo aplikasi dan daftar navigasi,
 * serta dapat bertransisi antara mode terbuka dan tertutup.
 */
function Sidebar({ isSidebarOpen }: SidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  // Fungsi pembantu untuk mengecek apakah path saat ini cocok (termasuk sub-rute)
  const isActive = (href: string) => location.pathname.startsWith(href);

  // Fungsi untuk mengecek apakah ada item anak yang aktif
  const isCategoryActive = (items: typeof planningItems) =>
    items.some((item) => isActive(item.href));

  // Tentukan accordion mana yang harus terbuka berdasarkan rute aktif
  const defaultAccordionValue = React.useMemo(() => {
    const activeCategories = [];
    if (isCategoryActive(planningItems)) activeCategories.push("perencanaan");
    if (isCategoryActive(analysisItems)) activeCategories.push("analisis");
    return activeCategories;
  }, [location.pathname]);

  const NavLink = ({
    href,
    icon: Icon,
    label,
    isChild = false,
    className: additionalClassName = "",
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    isChild?: boolean;
    className?: string;
  }) => (
    <Link
      to={href}
      className={cn(
        // Gaya dasar:
        "flex items-center rounded-lg px-3 text-muted-foreground transition-all hover:text-primary",

        // [PERUBAHAN 1] Padding vertikal dibuat kondisional
        // py-2 (lebih kecil) jika isChild, jika tidak py-3 (standar)
        isChild ? "py-2" : "py-3",

        // Gaya item anak (hanya jika sidebar terbuka)
        isChild && isSidebarOpen && "ml-4",

        // Beri warna berbeda untuk halaman aktif
        isActive(href) && "bg-muted text-primary",

        // Logika untuk alignment & gap
        !isSidebarOpen
          ? "justify-center" // Saat tertutup: HANYA justify-center.
          : "gap-3", // Saat terbuka: BARU tambahkan 'gap-3'.

        // Tambahkan className tambahan jika ada
        additionalClassName
      )}
    >
      {/* [PERUBAHAN 2] Ukuran ikon dibuat kondisional
          h-4 w-4 (lebih kecil) jika isChild, jika tidak h-5 w-5 (standar) */}
      <Icon className={cn(isChild ? "h-4 w-4" : "h-5 w-5")} />

      <span
        className={cn(
          "whitespace-nowrap transition-opacity duration-200",
          // [PERBAIKAN FINAL] 'hidden' akan menghapus span dari DOM flow.
          !isSidebarOpen ? "opacity-0 hidden" : "opacity-100",

          // [PERUBAHAN 3] Ukuran teks dibuat kondisional
          // text-xs (lebih kecil) jika isChild
          isChild && "text-xs"
        )}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      {/* ============================================
                ======== LOGO HEADER ===============
                ============================================
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
      */}
      <div className="flex-1 overflow-y-auto">
        {/* Tambahkan 'gap-y-1' untuk memberi jarak vertikal antar item */}
        <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4 gap-y-1">
          {/* 1. Render Item Tingkat Atas */}
          {topLevelNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* 2. Render Kategori yang Bisa Diciutkan (Accordion) */}
          <Accordion
            type="multiple"
            defaultValue={defaultAccordionValue}
            className="w-full"
          >
            {/* Kategori: Perencanaan */}
            <AccordionItem value="perencanaan" className="border-b-0">
              <AccordionTrigger
                className={cn(
                  // [PERBAIKAN FINAL] Gaya dasar: HAPUS 'gap-3' dari sini.
                  "flex items-center w-full rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:no-underline",
                  "text-sm font-medium",
                  !isSidebarOpen
                    ? "justify-center" // Tertutup: Center
                    : "gap-3", // Terbuka: Tambah gap
                  isCategoryActive(planningItems) && "text-primary",
                  // [PERBAIKAN FINAL] Sembunyikan ikon chevron (panah)
                  // bawaan shadcn saat sidebar tertutup.
                  "[&>.shrink-0]:hidden"
                )}
              >
                <ClipboardList className="h-5 w-5" />
                <span
                  className={cn(
                    "flex-1 text-left whitespace-nowrap transition-opacity duration-200",
                    // [PERBAIKAN FINAL] 'hidden' juga berlaku di sini.
                    !isSidebarOpen ? "opacity-0 hidden" : "opacity-100"
                  )}
                >
                  Perencanaan
                </span>
              </AccordionTrigger>
              {/* Tambah 'pt-1' dan 'space-y-1' untuk jarak antar item di dalam accordion */}
              <AccordionContent className="pb-0 pt-1 space-y-1">
                {planningItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    isChild
                    className="scale-105" // Slightly enlarge content in dropdown
                  />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Kategori: Analisis */}
            <AccordionItem value="analisis" className="border-b-0">
              <AccordionTrigger
                className={cn(
                  // [PERBAIKAN FINAL] Gaya dasar: HAPUS 'gap-3' dari sini.
                  "flex items-center w-full rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:no-underline",
                  "text-sm font-medium",
                  !isSidebarOpen
                    ? "justify-center" // Tertutup: Center
                    : "gap-3", // Terbuka: Tambah gap
                  isCategoryActive(analysisItems) && "text-primary",
                  // [PERBAIKAN FINAL] Sembunyikan ikon chevron (panah)
                  // bawaan shadcn saat sidebar tertutup.
                  "[&>.shrink-0]:hidden"
                )}
              >
                <PieChart className="h-5 w-5" />
                <span
                  className={cn(
                    "flex-1 text-left whitespace-nowrap transition-opacity duration-200",
                    // [PERBAIKAN FINAL] 'hidden' juga berlaku di sini.
                    !isSidebarOpen ? "opacity-0 hidden" : "opacity-100"
                  )}
                >
                  Analisis
                </span>
              </AccordionTrigger>
              {/* Tambah 'pt-1' dan 'space-y-1' untuk jarak antar item di dalam accordion */}
              <AccordionContent className="pb-0 pt-1 space-y-1">
                {analysisItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    isChild
                    className="scale-105" // Slightly enlarge content in dropdown
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* 3. Render Item Bawah */}
          {bottomNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* Logout Button */}
          <LogoutButton
            isSidebarOpen={isSidebarOpen}
            onClick={() => setIsDialogOpen(true)}
          />
        </nav>
      </div>
      <LogoutDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </div>
  );
}

// Logout Button Component
const LogoutButton = ({ isSidebarOpen, onClick }: { isSidebarOpen: boolean; onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        " mt-60 items-center w-full text-red-400 hover:text-white rounded-lg px-3 py-3 transition-all",
        !isSidebarOpen ? "justify-center" : "gap-3",
        "bg-red-400 hover:bg-red-500 text-white"
      )}
    >
      <LogOut className={cn(isSidebarOpen ? "h-5 w-5" : "h-5 w-5")} />
      {isSidebarOpen && <span className="whitespace-nowrap">Keluar</span>}
    </Button>
  );
};

export default Sidebar;