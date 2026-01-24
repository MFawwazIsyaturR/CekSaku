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
    ResponsiveContainer,
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
import CountUp from "react-countup";

const AdminDashboard = () => {
    const [range, setRange] = useState("7d");

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

    const statsCards = [
        {
            title: "Total Pengguna",
            value: stats.totalUsers,
            description: "Pengguna terdaftar",
            icon: Users,
            trend: `${stats.trends.users > 0 ? "+" : ""}${stats.trends.users}%`,
            trendUp: stats.trends.users >= 0,
            type: "users",
        },
        {
            title: "Total Transaksi",
            value: stats.totalTransactions,
            description: "Transaksi tercatat",
            icon: Activity,
            trend: `${stats.trends.transactions > 0 ? "+" : ""}${stats.trends.transactions}%`,
            trendUp: stats.trends.transactions >= 0,
            type: "transactions",
        },
        {
            title: "Volume Transaksi",
            value: stats.totalTransactionAmount,
            description: "Total nilai transaksi",
            icon: DollarSign,
            trend: `${stats.trends.volume > 0 ? "+" : ""}${stats.trends.volume}%`,
            trendUp: stats.trends.volume >= 0,
            type: "currency",
        },
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
                        Dashboard Admin
                    </h1>
                    <p className="text-muted-foreground">
                        Ringkasan statistik keseluruhan sistem CekSaku
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-border rounded-lg shadow-sm font-medium text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="hidden sm:inline">Periode:</span>
                        <Select value={range} onValueChange={setRange}>
                            <SelectTrigger className="w-[140px] border-none bg-transparent h-auto p-0 focus:ring-0 font-bold">
                                <SelectValue placeholder="Pilih rentang" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border">
                                <SelectItem value="7d">7 Hari</SelectItem>
                                <SelectItem value="30d">30 Hari</SelectItem>
                                <SelectItem value="90d">90 Hari</SelectItem>
                                <SelectItem value="12m">12 Bulan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid - Glassmorphism Style */}
            <div className="grid gap-6 md:grid-cols-3">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-lg rounded-xl border border-white/20 dark:border-gray-700/40 transition-all hover:scale-[1.02]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {statsLoading ? "..." : (
                                    <CountUp
                                        end={stat.value}
                                        prefix={stat.type === "currency" ? "Rp" : ""}
                                        separator="."
                                        duration={1.5}
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "flex items-center text-xs font-bold",
                                    stat.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {stat.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Chart Section */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-lg rounded-xl border border-white/20 dark:border-gray-700/40">
                <CardHeader className="border-b border-white/20 dark:border-gray-700/40">
                    <CardTitle className="text-lg font-bold">Pertumbuhan Volume Transaksi</CardTitle>
                    <CardDescription>Visualisasi aktivitas ekonomi dalam rentang waktu terpilih</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <AreaChart data={stats.growthData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={12}
                                tickFormatter={(value) => {
                                    try {
                                        const date = new Date(value);
                                        return format(date, range === "12m" ? "MMM" : "d MMM");
                                    } catch (e) { return value; }
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={12}
                                tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
                            />
                            <ChartTooltip
                                cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                                content={<ChartTooltipContent
                                    labelFormatter={(val) => format(new Date(val), "EEEE, d MMMM yyyy")}
                                    indicator="dot"
                                />}
                            />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorVolume)"
                            />
                            <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Quick Stats Row - Glassy Detail Badges */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Pengguna Aktif", value: stats.activeUsers, icon: UserCheck, color: "text-violet-500", bg: "bg-violet-500/10", percent: (stats.activeUsers / stats.totalUsers) * 100 },
                    { label: "Admin Sistem", value: stats.adminCount, icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10", percent: (stats.adminCount / stats.totalUsers) * 100 },
                    { label: "Transaksi Hari Ini", value: stats.todayTransactions, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", percent: (stats.todayTransactions / stats.totalTransactions) * 100 },
                ].map((item, idx) => (
                    <Card key={idx} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-none shadow-sm rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl", item.bg)}>
                                    <item.icon className={cn("h-6 w-6", item.color)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-bold">{statsLoading ? "..." : item.value.toLocaleString()}</h4>
                                        <span className="text-[10px] font-black tracking-widest uppercase opacity-40">Static</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                                    <span>Rasio</span>
                                    <span>{Math.round(item.percent || 0)}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", item.color.replace('text-', 'bg-'))}
                                        style={{ width: `${item.percent || 0}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
