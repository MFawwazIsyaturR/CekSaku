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
import { id } from "date-fns/locale";
import { useGetAdminStatsQuery } from "@/features/user/userAPI";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";

const AdminDashboard = () => {
    const [dateRange, setDateRange] = useState<DateRangeType>(null);

    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery(dateRange?.value || "7d");
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
        {
            title: "Transaksi Hari Ini",
            value: stats.todayTransactions,
            description: "Transaksi hari ini",
            icon: TrendingUp,
            trend: "+0%",
            trendUp: true,
            type: "transactions",
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
                    <DateRangeSelect dateRange={dateRange} setDateRange={setDateRange} />
                </div>
            </div>

            {/* Stats Cards Grid - Glassmorphism Style */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                                        return format(date, dateRange?.value === "12m" ? "MMM" : "d MMM", { locale: id });
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
                                    labelFormatter={(val) => format(new Date(val), "EEEE, d MMMM yyyy", { locale: id })}
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
        </div>
    );
};

export default AdminDashboard;
