import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    useGetAdminPaymentLogsQuery
} from "@/features/user/userAPI";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency";

const PaymentManagement = () => {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const { data, isLoading } = useGetAdminPaymentLogsQuery({
        page,
        limit: 10,
        search,
    }, {
        pollingInterval: 5000, // Sync every 5 seconds
        refetchOnFocus: true,
    });

    const paymentLogs = data?.data?.paymentLogs || [];
    const totalPages = data?.data?.pagination?.totalPages || 1;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SUKSES":
                return (
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm border-none animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Terbayar
                    </Badge>
                );
            case "PROSES":
                return (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 animate-pulse">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        Diproses
                    </Badge>
                );
            case "BELUM DIBAYAR":
                return (
                    <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200">
                        <XCircle className="mr-1 h-3.5 w-3.5" />
                        Belum Bayar
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Kelola Pembayaran</h1>
                <p className="text-muted-foreground">
                    Kelola riwayat transaksi dan status pembayaran user dari payment gateway.
                </p>
            </div>

            <Card className="border-none shadow-lg">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-semibold">Daftar Transaksi</CardTitle>
                        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari Nama atau Email user..."
                                    className="pl-9 h-10"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="h-10 px-4">Cari</Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                <TableRow>
                                    <TableHead className="font-semibold">User</TableHead>
                                    <TableHead className="font-semibold">Order ID</TableHead>
                                    <TableHead className="font-semibold">Plan</TableHead>
                                    <TableHead className="font-semibold">Jumlah</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-right">Tgl Dibuat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                Memuat data...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paymentLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data pembayaran ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paymentLogs.map((log) => (
                                        <TableRow key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{log.userId?.name || "User Tidak Dikenal"}</span>
                                                    <span className="text-xs text-muted-foreground">{log.userId?.email || "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                                                {log.orderId}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium">
                                                    {log.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(log.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(log.status)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                                {format(new Date(log.createdAt), "dd/MM/yy HH:mm")}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>


                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan halaman {page} dari {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-9 px-3"
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="h-9 px-3"
                                >
                                    Berikutnya
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentManagement;
