// client/src/pages/dashboard/_component/summary-card.tsx
import { FC } from "react";
import CountUp from "react-countup";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  LucideIcon,
  Landmark, // Example for Available Balance
  ArrowDownLeft, // Example for Total Expenses
  ArrowUpRight, // Example for Total Income
  Clock, // Example for Savings Rate
} from "lucide-react";
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
  Icon: LucideIcon; // Keep status icon for savings card text
  description?: string;
};

// Map card types to specific icons for the top right
const cardIcons: Record<CardType, LucideIcon> = {
  balance: Landmark,
  income: ArrowUpRight,
  expenses: ArrowDownLeft,
  savings: Clock,
};

interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number; // Keep for savings card logic
  cardType: CardType;
}

// Keep getCardStatus logic mostly the same for text status on savings card
const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "Tidak Ada Data Tabungan",
        color: "text-gray-400 dark:text-gray-500",
        Icon: TrendingDownIcon,
      };
    }
    if (value < 10) {
      return {
        label: "Tabungan Rendah",
        color: "text-red-500 dark:text-red-400",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }
    if (value < 20) {
      return {
        label: "Tabungan Cukup",
        color: "text-yellow-500 dark:text-yellow-400",
        Icon: TrendingUpIcon, // Can be neutral or up
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }
    // High savings checks
    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "Pengeluaran Tinggi",
        color: "text-red-500 dark:text-red-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }
    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Cek Pengeluaran",
        color: "text-orange-500 dark:text-orange-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }
    return {
      label: "Tabungan yang Bagus!",
      color: "text-green-600 dark:text-green-400",
      Icon: TrendingUpIcon,
    };
  }

  // Simplified status for non-savings cards (mainly for text color)
  if (cardType === "balance" && value < 0) {
    return {
      label: "",
      color: "text-red-600 dark:text-red-400",
      Icon: TrendingDownIcon,
    };
  }
  // Default empty status for others if needed, though color might be handled directly
  return {
    label: "",
    color: "text-gray-500 dark:text-gray-400",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    return value <= 0 ? "positive" : "negative"; // Lower expenses are positive
  }
  return value >= 0 ? "positive" : "negative"; // Higher income/balance is positive
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
    cardType !== "savings"; // Don't show trend icon/text for savings rate itself

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  const CardIcon = cardIcons[cardType]; // Get the specific icon for this card type

  const formatCountupValue = (val: number) => {
    return isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 }) // Always 1 decimal for savings rate
      : formatCurrency(val, {
          decimalPlaces: 0, // No decimals for currency in cards
          isExpense: cardType === "expenses",
          // Show sign only if balance is negative, handled by color below
          showSign: false,
        });
  };

  const formattedValueString = formatCountupValue(value);
  // Simplified font size logic for cleaner look
  let valueFontSize = "text-2xl"; // Default size
  if (formattedValueString.length > 12) {
    valueFontSize = "text-xl"; // Smaller for very large numbers
  }

  if (isLoading) {
    return (
      // Use standard Card component styling for consistency
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow rounded-lg border border-white/20 dark:border-gray-700/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-lg rounded-lg border border-white/20 dark:border-gray-700/40 transition-all hover:bg-white/70 dark:hover:bg-gray-800/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        {/* Card specific icon */}
        <CardIcon className="h-5 w-5 text-gray-00 dark:text-gray-500" />
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "font-bold",
            valueFontSize, // Dynamic font size
            // Apply color based on type and value
            cardType === "balance" && value < 0
              ? "text-red-600 dark:text-red-400"
              : cardType === "expenses"
              ? "text-red-600 dark:text-red-400"
              : cardType === "income"
              ? "text-green-600 dark:text-green-400"
              : "text-gray-900 dark:text-white" // Default/Savings
          )}
        >
          <CountUp
            start={0}
            end={value}
            preserveValue
            decimals={isPercentageValue ? 1 : 0} // Decimals based on type
            decimalPlaces={isPercentageValue ? 1 : 0}
            formattingFn={formatCountupValue}
          />
        </div>

        {/* Subtext with percentage change or status */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {cardType === "savings" ? (
            // Specific text for savings card
            <span className={status.color}>
              <status.Icon className="inline h-3 w-3 mr-1" />
              {status.label} {value !== 0 && `(${formatPercentage(value)})`}
            </span>
          ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
            // Text for "All Time" range
            <span>{dateRange?.label}</span>
          ) : showTrend ? (
            // Trend text for other cards
            <span className="flex items-center gap-1">
              {percentageChange !== 0 && (
                <span
                  className={cn(
                    "flex items-center",
                    trendDirection === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {trendDirection === "positive" ? (
                    <TrendingUpIcon className="h-3 w-3" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3" />
                  )}
                  {formatPercentage(percentageChange || 0, {
                    showSign: false, // Sign indicated by icon/color
                    decimalPlaces: 1,
                  })}
                </span>
              )}
              {percentageChange === 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  {formatPercentage(0, { showSign: false, decimalPlaces: 1 })}
                </span>
              )}
              for {dateRange?.label?.replace("untuk ", "") ?? "the period"}
            </span>
          ) : (
            // Fallback text if no trend data
            <span>
              for {dateRange?.label?.replace("untuk ", "") ?? "the period"}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
