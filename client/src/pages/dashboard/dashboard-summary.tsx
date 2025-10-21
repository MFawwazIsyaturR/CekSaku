import { useTypedSelector } from "@/app/hook";
import DashboardHeader from "./_component/dashboard-header";
import DashboardStats from "./_component/dashboard-stats";
import { DateRangeType } from "@/components/date-range-select";

const DashboardSummary = ({dateRange, setDateRange}: {dateRange?: DateRangeType; setDateRange?: (range: DateRangeType) => void}) => {
  const {user} = useTypedSelector((state) => state.auth);

  return (
      <div className="w-full">
        <DashboardHeader
          title={`Selamat datang kembali, ${user?.name || "Unknown"}`}
          subtitle="Ini adalah laporan gambaran umum Anda untuk periode yang dipilih."
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <DashboardStats 
        dateRange={dateRange}
        />
      </div>
  );
};

export default DashboardSummary;