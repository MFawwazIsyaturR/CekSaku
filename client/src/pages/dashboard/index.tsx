// client/src/pages/dashboard/index.tsx
import { useState } from "react";
import DashboardPageHeader from "./_component/dashboard-page-header";
import DashboardStats from "./_component/dashboard-stats";
// import QuickActions from "./_component/quick-actions";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import { DateRangeType } from "@/components/date-range-select";
import DashboardDataChart from "./dashboard-data-chart"; // <-- Impor kembali Data Chart

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>(null);

  return (
    // Padding utama untuk halaman
    <div className="p-6 md:p-8 space-y-6">

      {/* 1. Header Halaman */}
      <DashboardPageHeader dateRange={dateRange} setDateRange={setDateRange} />

      {/* 2. Kartu Ringkasan (Summary Cards) */}
      <DashboardStats dateRange={dateRange} />

      {/* 3. Grid untuk Quick Actions dan Chart */}
      {/* Gunakan grid 3 kolom di layar besar (lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions (1 kolom)
        <div className="lg:col-span-1">
          <QuickActions />
        </div> */}

        {/* Dashboard Data Chart (Grafik Garis - 1 kolom) */}
        <div className="lg:col-span-2">
          <DashboardDataChart dateRange={dateRange} />
        </div>

        {/* Expense Pie Chart (Grafik Pai - 1 kolom) */}
        <div className="lg:col-span-1">
          <ExpensePieChart dateRange={dateRange} />
        </div>
      </div>

      {/* 4. Riwayat Transaksi (Di luar grid, lebar penuh) */}
      <div className="w-full">
        <DashboardRecentTransactions />
      </div>

    </div>
  );
};

export default Dashboard;