export const formatCurrency = (value: number,
  options: { 
    currency?: string; 
    decimalPlaces?: number;
    compact?: boolean;
    showSign?: boolean;
    isExpense?: boolean;
  } = {}
):string => {
  const {
    currency = "IDR", 
    decimalPlaces = 2,
    compact = false,
    showSign = false,
  } = options;

    const displayValue = value;
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    notation: compact ? 'compact' : 'standard',
    //signDisplay: showSign  ? 'always' : isExpense ? 'always' : 'auto',
    signDisplay: showSign ? 'always' : 'auto',
  }).format(displayValue);
};
