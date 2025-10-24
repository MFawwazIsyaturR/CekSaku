import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import { useTypedSelector } from "@/app/hook";

interface Props {
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardPageHeader = ({ dateRange, setDateRange }: Props) => {
  const { user } = useTypedSelector((state) => state.auth);


  return (
    <div className="space-y-4">
      {/* Top Row: Welcome Message & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
          Selamat datang kembali, {user?.name || "User"}
        </h1>
        <div className="flex items-center gap-3 mt-8">
          <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
          <AddTransactionDrawer />
        </div>
      </div>

    
    </div>
  );
};

export default DashboardPageHeader;