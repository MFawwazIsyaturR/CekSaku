import { ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImportTransactionModal from "./import-transaction-modal";
import { useExportTransactionsMutation } from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

const BulkActions = () => {
  const [exportTransactions, { isLoading }] = useExportTransactionsMutation();

  const handleExport = async () => {
    const toastId = toast.loading("Mengekspor data transaksi...");

    try {
      const csvData = await exportTransactions().unwrap();

      if (!csvData) {
        toast.info("Tidak ada transaksi untuk diekspor.", { id: toastId });
        return;
      }

      // Buat Blob dari string CSV
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", "transaksi.csv");
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Transaksi berhasil diekspor!", { id: toastId });
    } catch (error) {
      console.error("Gagal mengekspor transaksi:", error);
      toast.error("Gagal mengekspor transaksi. Silakan coba lagi.", { id: toastId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="!cursor-pointer !text-white ">
          <ChevronDown className="h-4 w-4" />
          Impor / Ekspor
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="w-full">
            <ImportTransactionModal />
          </div>
        </DropdownMenuItem>

        
        <DropdownMenuItem onSelect={handleExport} disabled={isLoading}>
          <Upload className=" h-4 w-4" />
          <span>Ekspor Massal</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkActions;