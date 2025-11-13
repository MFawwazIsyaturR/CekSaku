// File: backend/src/cron/jobs/report.job.ts

import { endOfMonth, format, startOfMonth, subMonths, subWeeks, startOfWeek, endOfWeek, subYears, startOfYear, endOfYear } from "date-fns";
import ReportSettingModel, { ReportFrequencyEnum } from "../../models/report-setting.model";
import { UserDocument } from "../../models/user.model";
import mongoose from "mongoose";
import { generateReportService } from "../../services/report.service";
import ReportModel, { ReportStatusEnum } from "../../models/report.model";
import { calculateNextReportDate } from "../../utils/helper";
import { sendReportEmail } from "../../mailers/report.mailer";

export const processReportJob = async () => {
  const now = new Date();
  let processedCount = 0;
  let failedCount = 0;

  try {
    const reportSettingCursor = ReportSettingModel.find({
      isEnabled: true,
      nextReportDate: { $lte: now },
    })
      .populate<{ userId: UserDocument }>("userId")
      .cursor();

    console.log("Menjalankan tugas laporan...");

    for await (const setting of reportSettingCursor) {
      const user = setting.userId as UserDocument;
      if (!user) {
        console.log(`Pengguna tidak ditemukan untuk pengaturan: ${setting._id}`);
        continue;
      }

      // --- LOGIKA TANGGAL DINAMIS DIPINDAHKAN KE SINI ---
      let from: Date;
      let to: Date;

      switch (setting.frequency) {
        case ReportFrequencyEnum.WEEKLY:
          from = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
          to = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
          break;
        case ReportFrequencyEnum.YEARLY:
          from = startOfYear(subYears(now, 1));
          to = endOfYear(subYears(now, 1));
          break;
        case ReportFrequencyEnum.MONTHLY:
        default:
          from = startOfMonth(subMonths(now, 1));
          to = endOfMonth(subMonths(now, 1));
          break;
      }
      // --- AKHIR DARI LOGIKA TANGGAL DINAMIS ---

      const session = await mongoose.startSession();

      try {
        const report = await generateReportService(user.id, from, to);
        let emailSent = false;
        if (report) {
          try {
            await sendReportEmail({
              email: user.email!,
              username: user.name!,
              report: {
                period: report.period,
                totalIncome: report.summary.income,
                totalExpenses: report.summary.expenses,
                availableBalance: report.summary.balance,
                savingsRate: report.summary.savingsRate,
                topSpendingCategories: report.summary.topCategories,
                insights: report.insights,
              },
              frequency: setting.frequency!,
            });
            emailSent = true;
          } catch (error) {
            console.log(`Gagal mengirim email untuk ${user.id}`);
          }
        }

        await session.withTransaction(async () => {
          // Buat log laporan di database
          await ReportModel.create([{
            userId: user.id,
            sentDate: now,
            period: report?.period || `${format(from, "MMMM d")}–${format(to, "d, yyyy")}`,
            status: report ? (emailSent ? ReportStatusEnum.SENT : ReportStatusEnum.FAILED) : ReportStatusEnum.NO_ACTIVITY,
          }], { session });

          // Perbarui pengaturan untuk jadwal berikutnya
          await ReportSettingModel.updateOne(
            { _id: setting._id },
            {
              $set: {
                lastSentDate: report && emailSent ? now : setting.lastSentDate,
                nextReportDate: calculateNextReportDate(setting.frequency, now),
              },
            },
            { session }
          );
        });

        processedCount++;
      } catch (error) {
        console.log(`Gagal memproses laporan untuk pengguna ${user.id}`, error);
        failedCount++;
      } finally {
        await session.endSession();
      }
    }

    console.log(`✅ Diproses: ${processedCount} laporan`);
    console.log(`❌ Gagal: ${failedCount} laporan`);
    
  } catch (error) {
    console.error("Terjadi kesalahan saat memproses laporan", error);
  }
};