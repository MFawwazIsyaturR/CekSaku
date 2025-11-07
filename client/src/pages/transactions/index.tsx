// client/src/pages/transactions/index.tsx
import {
  Card,
  CardContent,
  CardHeader, // Import CardHeader
  CardTitle,   // Import CardTitle
  CardDescription // Import CardDescription
} from "@/components/ui/card";
// Remove PageLayout import
// import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import BulkActions from "@/components/transaction/bulk-actions";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer"; // <-- 1. IMPORT KOMPONEN

export default function Transactions() {
  return (
    // Remove PageLayout wrapper
    // <PageLayout ... >

    // Add main content wrapper with padding
    <div className="p-6 md:p-8 space-y-6">

      {/* Integrated Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Semua Transaksi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan semua transaksi Anda
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <BulkActions />
          <AddTransactionDrawer />
        </div>
      </div>

      {/* Card containing the table */}
      {/* Ensure Card uses default light/dark theme styles */}
      <Card className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        {/* CardContent might not need pt-0 if CardHeader provides enough space */}
        <CardContent className="pt-6"> {/* Adjusted padding-top */}
          <TransactionTable pageSize={20} />
        </CardContent>
      </Card>

      {/* 2. RENDER KOMPONEN DI SINI */}
      {/* Komponen ini akan "mendengarkan" perubahan URL dan tampil saat dibutuhkan */}
      <EditTransactionDrawer />
    </div>
    // </PageLayout>
  );
}