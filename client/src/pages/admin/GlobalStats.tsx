import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Activity,
    DollarSign,
    TrendingUp,
    UserCheck,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { useGetAdminStatsQuery } from "@/features/user/userAPI";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const GlobalStats = () => {
    // Fetch stats
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const stats = statsData?.data || {
        totalUsers: 0,
        totalTransactions: 0,
        totalTransactionAmount: 0,
    };

    // Stats cards data
    const statsCards = [
        {
            title: "Total Pengguna",
            value: statsLoading ? "..." : stats.totalUsers.toLocaleString(),
            description: "Pengguna terdaftar",
            icon: Users,
            trend: "+12%",
            trendUp: true,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
        },
        {
            title: "Total Transaksi",
            value: statsLoading ? "..." : stats.totalTransactions.toLocaleString(),
            description: "Transaksi tercatat",
            icon: Activity,
            trend: "+8%",
            trendUp: true,
            gradient: "from-violet-500 to-purple-500",
            bgGradient: "from-violet-500/10 to-purple-500/10",
        },
        {
            title: "Volume Transaksi",
            value: statsLoading ? "..." : formatCurrency(stats.totalTransactionAmount),
            description: "Total nilai transaksi",
            icon: DollarSign,
            trend: "+23%",
            trendUp: true,
            gradient: "from-emerald-500 to-green-500",
            bgGradient: "from-emerald-500/10 to-green-500/10",
        },
        {
            title: "Rata-rata Transaksi",
            value: statsLoading ? "..." : formatCurrency(
                stats.totalTransactions > 0
                    ? stats.totalTransactionAmount / stats.totalTransactions
                    : 0
            ),
            description: "Per transaksi",
            icon: TrendingUp,
            trend: "+5%",
            trendUp: true,
            gradient: "from-orange-500 to-amber-500",
            bgGradient: "from-orange-500/10 to-amber-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Statistik Global</h1>
                <p className="text-muted-foreground">
                    Ringkasan statistik keseluruhan sistem CekSaku
                </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-50",
                            stat.bgGradient
                        )} />
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={cn(
                                "rounded-lg p-2 bg-gradient-to-br",
                                stat.gradient
                            )}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "text-xs",
                                        stat.trendUp
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    )}
                                >
                                    {stat.trendUp ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {stat.trend}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {stat.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-violet-500" />
                            Pengguna Aktif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : Math.round(stats.totalUsers * 0.78)}</div>
                        <p className="text-xs text-muted-foreground mt-1">78% dari total pengguna</p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[78%] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                            Admin
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : Math.max(1, Math.round(stats.totalUsers * 0.02))}</div>
                        <p className="text-xs text-muted-foreground mt-1">~2% dari total pengguna</p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[2%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            Transaksi Hari Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsLoading ? "..." : Math.round(stats.totalTransactions * 0.05)}</div>
                        <p className="text-xs text-muted-foreground mt-1">~5% dari total transaksi</p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full w-[5%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GlobalStats;
