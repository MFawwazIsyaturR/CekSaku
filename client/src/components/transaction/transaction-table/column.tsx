/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowUpDown,
  CircleDot,
  Copy,
  Loader,
  LucideIcon,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  //StopCircleIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/format-currency";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";
import { TransactionType } from "@/features/transaction/transationType";
import { _TRANSACTION_FREQUENCY, _TRANSACTION_TYPE } from "@/constant";
import { useDeleteTransactionMutation, useDuplicateTransactionMutation } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";


type FrequencyInfo = {
  label: string;
  icon: LucideIcon;
};
type FrequencyMapType = {
  [key: string]: FrequencyInfo;
  DEFAULT: FrequencyInfo;
};

export const transactionColumns: ColumnDef<TransactionType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="!border-black data-[state=checked]:!bg-gray-800 !text-white"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="!border-black data-[state=checked]:!bg-gray-800 !text-white"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tanggal Dibuat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.getValue("createdAt"), "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="!pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Kategori
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div className="capitalize">
          {category}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tipe
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const transactionType = row.getValue("type") as string; // Dapatkan nilai tipe asli (INCOME/EXPENSE)
      const isIncome = transactionType === _TRANSACTION_TYPE.INCOME; // Cek apakah INCOME

      // Tentukan teks yang akan ditampilkan
      const displayText = isIncome ? "PEMASUKAN" : "PENGELUARAN";

      // Tentukan kelas CSS berdasarkan tipe
      const displayClasses = isIncome
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" // Kelas untuk Pemasukan
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"; // Kelas untuk Pengeluaran

      return (
        <div>
          <span
            // Terapkan kelas CSS yang sudah ditentukan
            className={`px-2 py-1 rounded-full text-xs font-medium ${displayClasses}`}
          >
            {/* Tampilkan displayText yang sudah ditentukan */}
            {displayText}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // Filter tetap berdasarkan nilai asli (INCOME/EXPENSE) jika diperlukan
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Jumlah</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type");

      return (
        <div
          className={`text-right font-medium ${type === _TRANSACTION_TYPE.INCOME
              ? "text-green-600"
              : "text-destructive"
            }`}
        >
          {type === _TRANSACTION_TYPE.EXPENSE ? "-" : "+"}
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tanggal Transaksi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.original.date, "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "paymentMethod",
    header: "Metode Pembayaran",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      if (!paymentMethod) return "N/A";
      //remove _
      const paymentMethodWithoutUnderscore = paymentMethod?.replace("_", " ")?.toLowerCase();
      return (
        <div className="capitalize">
          {paymentMethodWithoutUnderscore}
        </div>
      );
    },
  },
  {
    accessorKey: "recurringInterval",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Frekuensi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const frequency = row.getValue("recurringInterval");
      const nextDate = row.original?.nextRecurringDate;
      const isRecurring = row.original?.isRecurring;

      const frequencyMap: FrequencyMapType = isRecurring
        ? {
          [_TRANSACTION_FREQUENCY.DAILY]: { label: "Daily", icon: RefreshCw },
          [_TRANSACTION_FREQUENCY.WEEKLY]: { label: "Weekly", icon: RefreshCw },
          [_TRANSACTION_FREQUENCY.MONTHLY]: { label: "Monthly", icon: RefreshCw },
          [_TRANSACTION_FREQUENCY.YEARLY]: { label: "Yearly", icon: RefreshCw },
          DEFAULT: { label: "One-time", icon: CircleDot } // Fallback
        }
        : { DEFAULT: { label: "One-time", icon: CircleDot } };

      const frequencyKey = isRecurring ? (frequency as string) : "DEFAULT";
      const frequencyInfo = frequencyMap?.[frequencyKey] || frequencyMap.DEFAULT;
      const { label, icon: Icon } = frequencyInfo;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{label}</span>
            {nextDate && isRecurring && (
              <span className="text-xs text-muted-foreground">
                Next: {format(nextDate, "dd MMM yyyy", { locale: id })}
              </span>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionsCell = ({ row }: { row: any }) => {
  //const isRecurring = row.original.isRecurring;
  const transactionId = row.original.id;
  const { onOpenDrawer } = useEditTransactionDrawer();
  const [duplicateTransaction, { isLoading: isDuplicating }] = useDuplicateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();


  const handleDuplicate = (e: Event) => {
    e.preventDefault();
    if (isDuplicating) return;
    duplicateTransaction(transactionId).unwrap().then(() => {
      toast.success("Transaksi berhasil digandakan");
    }).catch((error) => {
      toast.error(error.data?.message || "Gagal menggandakan transaksi");
    });

  }

  const handleDelete = (e: Event) => {
    e.preventDefault();
    if (isDeleting) return;
    deleteTransaction(transactionId).unwrap().then(() => {
      toast.success("Transaksi berhasil dihapus");
    }).catch((error) => {
      toast.error(error.data?.message || "Gagal menghapus transaksi");
    });

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end"
        onCloseAutoFocus={(e) => {
          if (isDeleting || isDuplicating) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuItem onClick={() => onOpenDrawer(transactionId)}>
          <Pencil className="mr-1 h-4 w-4" />
          Ubah
        </DropdownMenuItem>
        <DropdownMenuItem
          className="relative"
          disabled={isDuplicating}
          onSelect={handleDuplicate}
        >
          <Copy className="mr-1 h-4 w-4" />
          Duplikat
          {isDuplicating && <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />}
        </DropdownMenuItem>

        {/* {isRecurring && (
          <>
            <DropdownMenuItem>
              <StopCircleIcon className="mr-1 h-4 w-4" />
              Stop Recurring
            </DropdownMenuItem>
          </>
        )} */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="relative !text-destructive"
          disabled={isDeleting}
          onSelect={handleDelete}
        >
          <Trash2 className="mr-1 h-4 w-4 !text-destructive" />
          Hapus
          {isDeleting && <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

