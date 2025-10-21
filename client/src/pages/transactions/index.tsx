import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import BulkActions from "@/components/transaction/bulk-actions";

export default function Transactions() {
  return (
    <PageLayout
      title="Semua Transaksi"
      subtitle="Menampilkan semua transaksi Anda"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <BulkActions />
          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactionTable pageSize={20} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
