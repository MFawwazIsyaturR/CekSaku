import mongoose from "mongoose";
import TransactionModel, { TransactionTypeEnum } from "../../models/transaction.model";
import UserModel, { UserDocument } from "../../models/user.model"; // Import UserDocument
import { sendSavingsAlertEmail } from "../../mailers/savings-alert.mailer"; // Mailer baru
import { convertToDollarUnit } from "../../utils/format-currency";
import { startOfMonth, endOfMonth } from "date-fns"; // Untuk menentukan periode bulan

export const checkSavingsGoals = async () => {
  const now = new Date();
  let checkedCount = 0;
  let notificationSentCount = 0;
  let failedCount = 0;

  console.log("Memulai pengecekan target tabungan...");

  try {
    // Cari transaksi "Gaji" yang punya target tabungan dan belum dikirim notifnya
    const salaryTransactionsCursor = TransactionModel.find({
      category: { $regex: /^gaji$/i }, // Case-insensitive match for "Gaji"
      type: TransactionTypeEnum.INCOME,
      savingsGoalPercentage: { $exists: true, $ne: null },
      savingsAlertSent: false, // Hanya cek yang belum dikirim notifikasinya
    })
      .populate<{ userId: UserDocument }>("userId") // Populate user data
      .cursor();

    for await (const salaryTx of salaryTransactionsCursor) {
      checkedCount++;
      const user = salaryTx.userId; // User data sudah di-populate
      if (!user) {
        console.warn(`User tidak ditemukan untuk transaksi gaji: ${salaryTx._id}`);
        continue;
      }

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const salaryAmount = salaryTx.amount; // amount sudah dalam unit dollar (karena getter)
          const savingsGoalPercent = salaryTx.savingsGoalPercentage!;
          const nonSavedPortion = salaryAmount * (1 - savingsGoalPercent / 100);
          const notificationThresholdAmount = nonSavedPortion * 0.85; // Ambang batas 85%

          // Tentukan periode pengecekan (misal: dari tanggal gaji s/d akhir bulan gaji)
          const salaryDate = new Date(salaryTx.date);
          const periodStart = salaryDate; // Mulai dari tanggal gaji
          const periodEnd = endOfMonth(salaryDate); // Sampai akhir bulan gaji

           // Hitung total pengeluaran user dalam periode tersebut
          const expenseAggregation = await TransactionModel.aggregate([
            {
              $match: {
                userId: user._id,
                type: TransactionTypeEnum.EXPENSE,
                date: {
                  $gte: periodStart,
                  $lte: periodEnd,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalExpenses: { $sum: "$amount" }, // amount di DB adalah cents
              },
            },
          ]).session(session);

          const totalExpensesInCents = expenseAggregation[0]?.totalExpenses || 0;
          const totalExpensesInDollars = convertToDollarUnit(totalExpensesInCents);

          console.log(`User: ${user.email}, Gaji: ${salaryAmount}, Target: ${savingsGoalPercent}%, Sisa Target Pengeluaran: ${nonSavedPortion.toFixed(2)}, Batas Notif: ${notificationThresholdAmount.toFixed(2)}, Pengeluaran Aktual: ${totalExpensesInDollars.toFixed(2)}`);

          // Cek apakah pengeluaran melebihi ambang batas
          if (totalExpensesInDollars >= notificationThresholdAmount) {
            console.log(`Mengirim notifikasi ke ${user.email}...`);

            // Kirim email notifikasi
            await sendSavingsAlertEmail({
              email: user.email!,
              username: user.name!,
              savingsPercentage: savingsGoalPercent,
              thresholdAmount: notificationThresholdAmount,
              currentExpenses: totalExpensesInDollars,
              salaryAmount: salaryAmount,
              periodStartDate: periodStart,
              periodEndDate: periodEnd,
            });

            // Tandai bahwa notifikasi sudah dikirim
            await TransactionModel.updateOne(
              { _id: salaryTx._id },
              { $set: { savingsAlertSent: true } },
              { session }
            );
            notificationSentCount++;
            console.log(`Notifikasi terkirim ke ${user.email}.`);
          }
        }); // End transaction
      } catch (error: any) {
        failedCount++;
        console.error(`Gagal memproses target tabungan untuk tx: ${salaryTx._id}, user: ${user.email}`, error);
        // Pertimbangkan: roll back manual atau logika retry?
      } finally {
        await session.endSession();
      }
    } // End for await

    console.log(`✅ Target tabungan diperiksa: ${checkedCount}`);
    console.log(`📧 Notifikasi terkirim: ${notificationSentCount}`);
    console.log(`❌ Gagal diproses: ${failedCount}`);

    return {
      success: true,
      checkedCount,
      notificationSentCount,
      failedCount,
    };
  } catch (error: any) {
    console.error("Error saat memeriksa target tabungan", error);
    return {
      success: false,
      error: error?.message || "Proses pengecekan target tabungan gagal",
    };
  }
};