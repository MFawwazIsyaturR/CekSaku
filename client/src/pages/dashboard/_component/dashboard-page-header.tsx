import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import { useTypedSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardPageHeader = ({ dateRange, setDateRange }: Props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {/* Top Row: Welcome Message */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
          Selamat datang kembali, {user?.name || "User"}
        </h1>

        {/* Top Actions: DateRange & AddTransaction */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
          <AddTransactionDrawer />
        </div>
      </div>

      {/* Bottom Action: Upgrade Button */}
      <div>
        <Button
          onClick={() => navigate(PROTECTED_ROUTES.BILLING)}
          className="relative inline-flex overflow-hidden w-full md:w-auto rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white backdrop-blur-3xl dark:bg-slate-900 dark:text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </span>
        </Button>
      </div>
    </div>
  );
};


export default DashboardPageHeader;