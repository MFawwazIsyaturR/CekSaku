export const MAX_IMPORT_LIMIT = 300;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const INCOME_CATEGORIES = [
  { value: "gaji", label: "Gaji" },
  { value: "pemasukan", label: "Pemasukan" },
  { value: "investasi", label: "Investasi" },
  { value: "lainnya", label: "Lainnya" },
];

export const EXPENSE_CATEGORIES = [
  { value: "belanja", label: "Belanja Bulanan" },
  { value: "makan", label: "Makan & Restoran" },
  { value: "transportasi", label: "Transportasi" },
  { value: "tagihan", label: "Tagihan" },
  { value: "hiburan", label: "Hiburan" },
  { value: "belanja", label: "Belanja" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "liburan", label: "Liburan" },
  { value: "rumah", label: "Rumah & Sewa" },
  { value: "lainnya", label: "Lainnya" },
];

export const PAYMENT_METHODS_ENUM = {
  CARD: "CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
  CASH: "CASH",
  AUTO_DEBIT: "AUTO_DEBIT",
  OTHER: "OTHER",
} as const;

export const PAYMENT_METHODS = [
  { value: PAYMENT_METHODS_ENUM.CARD, label: "Kartu Kredit/Debit" },
  { value: PAYMENT_METHODS_ENUM.CASH, label: "Tunai" },
  { value: PAYMENT_METHODS_ENUM.BANK_TRANSFER, label: "Transfer Bank" },
  { value: PAYMENT_METHODS_ENUM.MOBILE_PAYMENT, label: "Pembayaran Mobile" },
  { value: PAYMENT_METHODS_ENUM.AUTO_DEBIT, label: "Auto Debit" },
  { value: PAYMENT_METHODS_ENUM.OTHER, label: "Lainnya" },
];

export const _TRANSACTION_FREQUENCY = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type TransactionFrequencyType = keyof typeof _TRANSACTION_FREQUENCY;

export const _TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type _TransactionType = keyof typeof _TRANSACTION_TYPE;

export const _TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type TransactionStatusType = keyof typeof _TRANSACTION_STATUS;

export const _REPORT_STATUS = {
  SENT: "SENT",
  FAILED: "FAILED",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  NO_ACTIVITY: "NO_ACTIVITY",
} as const;

export type ReportStatusType = keyof typeof _REPORT_STATUS;
