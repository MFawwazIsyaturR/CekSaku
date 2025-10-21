import { formatCurrency } from "../utils/format-currency";
import { getSavingsAlertEmailTemplate } from "./templates/savings-alert.template"; 
import { sendEmail } from "./mailer";
import { format } from "date-fns";

type SavingsAlertParams = {
  email: string;
  username: string;
  savingsPercentage: number;
  thresholdAmount: number; // Jumlah pengeluaran (85% dari sisa)
  currentExpenses: number; // Pengeluaran saat ini
  salaryAmount: number;
  periodStartDate: Date;
  periodEndDate: Date;
};

export const sendSavingsAlertEmail = async (params: SavingsAlertParams) => {
  const {
    email,
    username,
    savingsPercentage,
    thresholdAmount,
    currentExpenses,
    salaryAmount,
    periodStartDate,
    periodEndDate
  } = params;

  const nonSavedPortion = salaryAmount * (1 - savingsPercentage / 100);
  const periodString = `${format(periodStartDate, "d MMM")} - ${format(periodEndDate, "d MMM yyyy")}`;

  const html = getSavingsAlertEmailTemplate({
    username,
    savingsPercentage,
    thresholdAmount,
    currentExpenses,
    nonSavedPortion, // Kirim juga total sisa yg boleh dibelanjakan
    period: periodString,
  });

  const text = `Halo ${username},
Peringatan Pengeluaran Gaji Periode ${periodString}!

Anda menetapkan target tabungan ${savingsPercentage}% dari gaji Anda (${formatCurrency(salaryAmount)}).
Sisa dana yang dialokasikan untuk pengeluaran adalah ${formatCurrency(nonSavedPortion)}.

Pengeluaran Anda saat ini (${formatCurrency(currentExpenses)}) telah mencapai atau melebihi 85% (${formatCurrency(thresholdAmount)}) dari alokasi tersebut.

Harap perhatikan pengeluaran Anda selanjutnya.

Terima kasih,
Tim CekSaku
`;

  return sendEmail({
    to: email,
    subject: `⚠️ Peringatan: Pengeluaran Gaji Hampir Mencapai Batas (${periodString})`,
    text,
    html,
  });
};