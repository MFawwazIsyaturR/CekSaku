import { formatCurrency } from "../../utils/format-currency";

type SavingsAlertTemplateData = {
  username: string;
  savingsPercentage: number;
  thresholdAmount: number; // Jumlah pengeluaran (85% dari sisa)
  currentExpenses: number; // Pengeluaran saat ini
  nonSavedPortion: number; // Total sisa yg boleh dibelanjakan
  period: string; // Misal: "1 Okt - 31 Okt 2025"
};

export const getSavingsAlertEmailTemplate = (data: SavingsAlertTemplateData) => {
  const {
    username,
    savingsPercentage,
    thresholdAmount,
    currentExpenses,
    nonSavedPortion,
    period,
  } = data;
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
 <html lang="id">
   <head>
     <meta charset="UTF-8" />
     <title>Peringatan Pengeluaran Gaji</title>
     <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
   </head>
   <body style="margin: 0; padding: 0; font-family: 'Roboto', Arial, sans-serif; background-color: #fdf2f2; font-size: 16px;">
     <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #fdf2f2; padding: 20px;">
       <tr>
         <td>
           <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05); border: 1px solid #fecaca;">
             <tr>
               <td style="background-color: #ef4444; padding: 20px 30px; color: #ffffff; text-align: center;">
                 <h2 style="margin: 0; font-size: 24px;">⚠️ Peringatan Pengeluaran Gaji</h2>
               </td>
             </tr>
             <tr>
               <td style="padding: 20px 30px;">
                 <p style="margin: 0 0 10px; font-size: 16px;">Halo <strong>${username}</strong>,</p>
                 <p style="margin: 0 0 20px; font-size: 16px;">Ini adalah peringatan mengenai pengeluaran Anda untuk periode gaji <strong>${period}</strong>.</p>

                 <p style="font-size: 16px; margin-bottom: 15px;">Anda menetapkan target untuk menabung <strong>${savingsPercentage}%</strong> dari gaji Anda. Ini berarti alokasi dana untuk pengeluaran Anda adalah sekitar <strong>${formatCurrency(nonSavedPortion)}</strong>.</p>

                 <p style="font-size: 16px; margin-bottom: 15px;">Pengeluaran Anda saat ini telah mencapai <strong>${formatCurrency(currentExpenses)}</strong>. Jumlah ini telah mencapai atau melebihi batas peringatan 85% (<strong>${formatCurrency(thresholdAmount)}</strong>) dari alokasi pengeluaran Anda.</p>

                 <p style="font-size: 16px; margin-bottom: 25px;">Mohon perhatikan pengeluaran Anda selanjutnya agar tetap sesuai dengan rencana keuangan Anda.</p>

                 <p style="margin-top: 30px; font-size: 13px; color: #888;">Notifikasi ini dikirim otomatis oleh sistem CekSaku.</p>
               </td>
             </tr>
             <tr>
               <td style="background-color: #fef2f2; text-align: center; padding: 15px; font-size: 12px; color: #999;">
                 &copy; ${currentYear} CekSaku. Semua hak cipta dilindungi.
               </td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
   </body>
 </html>
   `;
};