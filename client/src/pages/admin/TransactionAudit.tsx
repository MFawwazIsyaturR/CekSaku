import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAdminAllTransactionsQuery } from "@/features/user/userAPI";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAdminDeleteTransactionMutation } from "@/features/user/userAPI";
import { MoreHorizontal, Trash2 } from "lucide-react";

const TransactionAudit = () => {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [txToDelete, setTxToDelete] = useState<string | null>(null);

    const { data, isLoading } = useGetAdminAllTransactionsQuery({
        page,
        limit: 15,
        search,
    });

    const [deleteTransaction, { isLoading: isDeleting }] = useAdminDeleteTransactionMutation();

    const transactions = data?.data?.transactions || [];
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages || 1;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleDelete = async () => {
        if (!txToDelete) return;
        try {
            await deleteTransaction(txToDelete).unwrap();
            toast.success("Transaksi berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus transaksi");
        } finally {
            setTxToDelete(null);
        }
    };

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Audit Transaksi</h2>
                <p className="text-muted-foreground">
                    Pantau dan audit seluruh riwayat transaksi pengguna di sistem CekSaku.
                </p>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Semua Transaksi</CardTitle>
                            <CardDescription>
                                Menampilkan total {pagination?.total || 0} transaksi.
                            </CardDescription>
                        </div>
                        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari deskripsi transaksi..."
                                    className="pl-9"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <Button type="submit">
                                Cari
                            </Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[180px]">Tanggal</TableHead>
                                    <TableHead>Pengguna</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-right">Nominal</TableHead>
                                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Memuat data transaksi...
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Tidak ada transaksi ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => {
                                        const dateObj = transaction.date ? new Date(transaction.date) : null;
                                        const isDateValid = dateObj && !isNaN(dateObj.getTime());
                                        const type = (transaction.type || "").toLowerCase();
                                        const isIncome = type === 'income';

                                        return (
                                            <TableRow key={transaction._id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">
                                                    {isDateValid ? (
                                                        format(dateObj as Date, "dd MMM yyyy, HH:mm")
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-xs">Tanggal tidak valid</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.userId && typeof transaction.userId === 'object' ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">{(transaction.userId as any).name || "Unknown"}</span>
                                                            <span className="text-xs text-muted-foreground">{(transaction.userId as any).email || ""}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            {transaction.userId ? `ID: ${transaction.userId}` : "User Dihapus"}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{transaction.title || "Tanpa Judul"}</span>
                                                        {transaction.description && (
                                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                {transaction.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize font-normal">
                                                        {transaction.category || "General"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={cn(
                                                        "flex items-center justify-end font-bold",
                                                        isIncome ? "text-emerald-600" : "text-red-600"
                                                    )}>
                                                        {isIncome ? (
                                                            <ArrowUpRight className="mr-1 h-3 w-3" />
                                                        ) : (
                                                            <ArrowDownRight className="mr-1 h-3 w-3" />
                                                        )}
                                                        {formatCurrency(transaction.amount || 0)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => setTxToDelete(transaction._id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus Transaksi
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan halaman {page} dari {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Berikutnya
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!txToDelete} onOpenChange={() => setTxToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Transaksi ini akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TransactionAudit;
