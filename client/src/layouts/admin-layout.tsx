import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Users, TrendingUp } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";

const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid },
    { label: "Daftar Pengguna", href: "/admin/users", icon: Users },
    { label: "Statistik Global", href: "/admin/stats", icon: TrendingUp },
];

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);





    return (
        <div className="flex min-h-screen w-full bg-[var(--bg-color)] dark:bg-background">
            {/* Sidebar Container */}
            <aside
                className={cn(
                    "hidden md:block sticky top-0 h-screen z-40 border-r bg-background",
                    "transition-[width] duration-300 ease-in-out",
                    "overflow-hidden",
                    isSidebarOpen ? "w-[280px]" : "w-[72px]"
                )}
            >
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    isAdmin={true}
                    items={adminNavItems}
                />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Admin Dashboard</span>
                    </div>
                </header>

                <main className="flex-1 bg-gray-100/40 dark:bg-gray-900/50">
                    <div className="p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
