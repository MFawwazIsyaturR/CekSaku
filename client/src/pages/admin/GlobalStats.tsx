import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    Activity,
    DollarSign,
    TrendingUp,
    UserCheck,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { useGetAdminStatsQuery } from "@/features/user/userAPI";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const GlobalStats = () => {
    const [range, setRange] = useState("7d");

    // Fetch stats with range
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery(range);
    const stats = statsData?.data || {
        totalUsers: 0,
        totalTransactions: 0,
        totalTransactionAmount: 0,
        activeUsers: 0,
        adminCount: 0,
        todayTransactions: 0,
        trends: {
            users: 0,
            transactions: 0,
            volume: 0,
        },
        growthData: [],
        range: "7d",
    };

    const chartConfig = {
        volume: {
            label: "Volume Transaksi",
            color: "hsl(var(--primary))",
        },
    } satisfies ChartConfig;

    // Stats cards data
    const statsCards = [
        {
            title: "Total Pengguna",
            value: statsLoading ? "..." : stats.totalUsers.toLocaleString(),
            description: "Pengguna terdaftar",
            icon: Users,
            trend: `${stats.trends.users > 0 ? "+" : ""}${stats.trends.users}%`,
            trendUp: stats.trends.users >= 0,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
        },
        {
            title: "Total Transaksi",
            value: statsLoading ? "..." : stats.totalTransactions.toLocaleString(),
            description: "Transaksi tercatat",
            icon: Activity,
            trend: `${stats.trends.transactions > 0 ? "+" : ""}${stats.trends.transactions}%`,
            trendUp: stats.trends.transactions >= 0,
            gradient: "from-violet-500 to-purple-500",
            bgGradient: "from-violet-500/10 to-purple-500/10",
        },
        {
            title: "Volume Transaksi",
            value: statsLoading ? "..." : formatCurrency(stats.totalTransactionAmount),
            description: "Total nilai transaksi",
            icon: DollarSign,
            trend: `${stats.trends.volume > 0 ? "+" : ""}${stats.trends.volume}%`,
            trendUp: stats.trends.volume >= 0,
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
            trend: "+0%", // Aggregated trend for avg is complex, keeping simple
            trendUp: true,
            gradient: "from-orange-500 to-amber-500",
            bgGradient: "from-orange-500/10 to-amber-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Statistik Global</h1>
                    <p className="text-muted-foreground">
                        Ringkasan statistik keseluruhan sistem CekSaku
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue placeholder="Pilih rentang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                            <SelectItem value="90d">90 Hari Terakhir</SelectItem>
                            <SelectItem value="12m">12 Bulan Terakhir</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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

            {/* Growth Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Pertumbuhan Volume Transaksi</CardTitle>
                    <CardDescription>Visualisasi aktivitas transaksi dalam rentang waktu terpilih</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[350px]">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[350px] w-full"
                    >
                        <AreaChart
                            data={stats.growthData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    try {
                                        const date = new Date(value);
                                        if (range === "12m") {
                                            return format(date, "MMM");
                                        }
                                        return format(date, "d MMM");
                                    } catch (e) {
                                        return value;
                                    }
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
                            />
                            <ChartTooltip
                                cursor={true}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            try {
                                                return format(new Date(value), "EEEE, d MMMM yyyy");
                                            } catch (e) {
                                                return value;
                                            }
                                        }}
                                        indicator="line"
                                        formatter={(value, name) => [
                                            <span key={name} className="font-medium">
                                                {formatCurrency(Number(value))}
                                            </span>,
                                            chartConfig[name as keyof typeof chartConfig]?.label || name
                                        ]}
                                    />
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorVolume)"
                            />
                            <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

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
                        <div className="text-2xl font-bold">{statsLoading ? "..." : stats.activeUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.totalUsers > 0
                                ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% dari total pengguna aktif (30 hari terakhir)`
                                : "0% dari total pengguna"}
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                            />
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
                        <div className="text-2xl font-bold">{statsLoading ? "..." : stats.adminCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.totalUsers > 0
                                ? `${((stats.adminCount / stats.totalUsers) * 100).toFixed(1)}% dari total pengguna`
                                : "0% dari total pengguna"}
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                                style={{ width: `${stats.totalUsers > 0 ? (stats.adminCount / stats.totalUsers) * 100 : 0}%` }}
                            />
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
                        <div className="text-2xl font-bold">{statsLoading ? "..." : stats.todayTransactions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.totalTransactions > 0
                                ? `${((stats.todayTransactions / stats.totalTransactions) * 100).toFixed(1)}% dari total transaksi`
                                : "Baru hari ini"}
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                                style={{ width: `${stats.totalTransactions > 0 ? (stats.todayTransactions / stats.totalTransactions) * 100 : 0}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GlobalStats;
