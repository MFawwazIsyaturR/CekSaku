import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
};

interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "Tidak Ada Catatan Tabungan",
        color: "text-gray-400",
        Icon: TrendingDownIcon,
      };
    }

    // Check savings percentage first
    if (value < 10) {
      return {
        label: "Tabungan Rendah",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }

    if (value < 20) {
      return {
        label: "Sedang",
        color: "text-yellow-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }

    // High savings → check if expense ratio is unusually high for warning
    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "Pengeluaran Tinggi",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Peringatan: Pengeluaran Tinggi",
        color: "text-orange-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    return {
      label: "Tabungan yang Hebat!",
      color: "text-green-400",
      Icon: TrendingUpIcon,
    };
  }

  if (value === 0) {
    const typeLabel =
      cardType === "income"
        ? "Income"
        : cardType === "expenses"
        ? "Expenses"
        : "Balance";

    return {
      label: `No ${typeLabel}`,
      color: "text-gray-400",
      Icon: TrendingDownIcon,
      description: ``,
    };
  }

  // For balance card when negative
  if (cardType === "balance" && value < 0) {
    return {
      label: "Saldo Minus",
      color: "text-red-400",
      Icon: TrendingDownIcon,
      description: "Saldo negatif",
    };
  }

  return {
    label: "",
    color: "",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    // For expenses, lower is better
    return value <= 0 ? "positive" : "negative";
  }
  // For income and balance, higher is better
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend =
    percentageChange !== undefined &&
    percentageChange !== null &&
    cardType !== "savings";

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  const formatCountupValue = (val: number) => {
    return isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, {
          isExpense: cardType === "expenses",
          showSign: cardType === "balance" && val < 0,
        });
  };

  const formattedValueString = formatCountupValue(value);
  let valueFontSize = "text-4xl"; // Ukuran default
  if (formattedValueString.length > 18) {
    valueFontSize = "text-2xl"; // Ukuran kecil untuk angka sangat panjang (ratusan juta/miliar)
  } else if (formattedValueString.length > 14) {
    valueFontSize = "text-3xl"; // Ukuran menengah untuk angka panjang (jutaan)
  }

  if (isLoading) {
    return (
      // --- PERUBAHAN DI SINI ---
      // 1. Hapus !border-none, !border-0, !gap-0
      // 2. Tambah backdrop-blur-lg (EFEK KACA)
      // 3. Tambah border border-white/10 (GARIS TEPI)
      // 4. Tambah shadow-lg (BAYANGAN)
      // 5. Tambah rounded-2xl (BIAR MODERN)
      <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5">
          <Skeleton className="h-4 w-24 bg-white/30" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-10.5 w-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 bg-white/30" />
            <Skeleton className="h-3 w-16 bg-white/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    // --- PERUBAHAN DI SINI ---
    // 1. Hapus !border-none, !border-0, !gap-0
    // 2. Tambah backdrop-blur-lg (EFEK KACA)
    // 3. Tambah border border-white/10 (GARIS TEPI)
    // 4. Tambah shadow-lg (BAYANGAN)
    // 5. Tambah rounded-2xl (BIAR MODERN)
    <Card className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg rounded-2xl group hover:scale-105 transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5">
        <CardTitle className="text-[15px] text-gray-300 font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* --- PENERAPAN FONT DINAMIS DI SINI --- */}
        <div
          className={cn(
            "font-bold", // Hapus 'text-4xl' dari sini
            valueFontSize, // Tambahkan kelas dinamis
            cardType === "balance" && value < 0 ? "text-red-400" : "text-white"
          )}
        >
          <CountUp
            start={0}
            end={value}
            preserveValue
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCountupValue}
          />
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          {cardType === "savings" ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={status.color}>
                {status.label} {value !== 0 && `(${formatPercentage(value)})`}
              </span>
              {status.description && (
                <span className="text-gray-400 ml-1">
                  • {status.description}
                </span>
              )}
            </div>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            <span className="text-gray-400">Menampilkan {dateRange?.label}</span>
          ) : value === 0 || status.label ? (
            <div className="flex items-center gap-1.5">
              <status.Icon className={cn("size-3.5", status.color)} />
              <span className={status.color}>{status.label}</span>
              {status.description && (
                <span className="text-gray-400">• {status.description}</span>
              )}
              {!status.description && (
                <span className="text-gray-400">• {dateRange?.label}</span>
              )}
            </div>
          ) : showTrend ? (
            <div className="flex items-center gap-1.5">
              {percentageChange !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-0.5",
                    trendDirection === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {trendDirection === "positive" ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  <span>
                    {formatPercentage(percentageChange || 0, {
                      showSign: percentageChange !== 0,
                      isExpense: cardType === "expenses",
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}

              {percentageChange === 0 && (
                <div className="flex items-center gap-0.5 text-gray-400">
                  <TrendingDownIcon className="size-3" />
                  <span>
                    {formatPercentage(0, {
                      showSign: false,
                      decimalPlaces: 1,
                    })}
                  </span>
                </div>
              )}
              <span className="text-gray-400">• {dateRange?.label}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;