// client/src/pages/settings/index.tsx
import { buttonVariants } from "@/components/ui/button"; // Mungkin tidak diperlukan lagi untuk tab
import {
    Card,
    CardContent,
  } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation, NavLink } from "react-router-dom"; // Import NavLink
// Hapus ItemPropsType jika SidebarNav dihapus
// interface ItemPropsType { ... }

const Settings = () => {

  const settingsNavItems = [
      { title: "Akun", href: PROTECTED_ROUTES.SETTINGS },
      { title: "Tampilan", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE },
      { title: "Keamanan", href: PROTECTED_ROUTES.SETTINGS_SECURITY },
      // Hapus atau beri komentar jika Billing tidak digunakan/belum siap
      // { title: "Tagihan", href: PROTECTED_ROUTES.SETTINGS_BILLING },
    ];

  const location = useLocation(); // Dapatkan lokasi untuk active state

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* Header Halaman Pengaturan */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Pengaturan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola pengaturan akun Anda dan atur preferensi e-mail.
          </p>
        </div>
      </div>

      {/* Konten Utama dengan Tab Navigasi */}
      <div className="space-y-6">
        {/* Navigasi Tab Horizontal */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {settingsNavItems.map((item) => {
               // Perbaikan logika isActive: cocokkan href atau jika href adalah /settings dan path dimulai dengan /settings/
               const isActive = location.pathname === item.href || (item.href === PROTECTED_ROUTES.SETTINGS && location.pathname === PROTECTED_ROUTES.SETTINGS);

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  // `end` prop diperlukan untuk 'Akun' agar tidak aktif saat di sub-route
                  end={item.href === PROTECTED_ROUTES.SETTINGS}
                  className={({ isActive: navIsActive }) => cn( // Gunakan isActive dari NavLink
                    "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150",
                    navIsActive // Gunakan navIsActive di sini
                      ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Card untuk Konten Outlet */}
        <Card className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6 pb-10">
            {/* Hapus layout flex lama */}
            {/* <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"> */}
              {/* Hapus aside */}
              {/* <aside className="lg:w-1/5"> ... </aside> */}

              {/* Langsung render Outlet */}
              <div className="flex-1 lg:max-w-4xl mx-auto"> {/* Beri max-width jika perlu */}
                <Outlet />
              </div>
            {/* </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hapus fungsi SidebarNav karena tidak digunakan lagi
// function SidebarNav({ items }:ItemPropsType) { ... }

export default Settings;