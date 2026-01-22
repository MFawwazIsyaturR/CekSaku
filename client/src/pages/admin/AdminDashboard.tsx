import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAdminStatsQuery, useGetUsersQuery } from "@/features/user/userAPI";

const AdminDashboard = () => {
    // Fetch stats for brief summary
    const { isLoading: statsLoading } = useGetAdminStatsQuery();

    const { data: usersData } = useGetUsersQuery({
        page: 1,
        limit: 1,
        search: "",
    });
    const totalUsers = usersData?.data.pagination.totalUsers || 0;


    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
                <p className="text-muted-foreground">
                    Selamat datang di panel admin. Silakan pilih menu di bawah ini.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User List Summary */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            Daftar Pengguna
                        </CardTitle>
                        <CardDescription>
                            Kelola semua pengguna terdaftar di aplikasi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <p className="text-2xl font-bold">{statsLoading ? "..." : totalUsers.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Pengguna Terdaftar</p>
                        </div>
                        <Link to="/admin/users">
                            <Button className="w-full group">
                                Lihat Daftar Pengguna
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Global Stats Summary */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            Statistik Global
                        </CardTitle>
                        <CardDescription>
                            Lihat ringkasan statistik transaksi dan aktivitas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-sm text-muted-foreground">Data Realtime Aktif</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Pantau performa sistem secara keseluruhan.</p>
                        </div>
                        <Link to="/admin/stats">
                            <Button variant="outline" className="w-full group">
                                Lihat Dashboard Statistik Global
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
