// client/src/pages/reports/index.tsx
import {
  Card,
  CardContent,
} from "@/components/ui/card";
// Hapus import PageLayout
// import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import ReportTable from "./_component/report-table";

export default function Reports() {
  return (
    // Hapus wrapper PageLayout
    // <PageLayout ... >

    // Tambahkan wrapper konten utama dengan padding
    <div className="p-6 md:p-8 space-y-6">

      {/* Header Terintegrasi */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Judul dan Subjudul */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
            Sejarah Laporan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat dan atur laporan keuangan Anda
          </p>
        </div>

        {/* Tombol Aksi (Tombol Pengaturan Laporan) */}
        <div className="self-start md:self-center">
          <ScheduleReportDrawer />
        </div>
      </div>

      {/* Card berisi tabel laporan */}
      <Card className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        {/* CardContent mungkin tidak perlu pt-0 jika header memberikan cukup ruang */}
        <CardContent className="pt-6"> {/* Menyesuaikan padding-top */}
          <ReportTable />
        </CardContent>
      </Card>
    </div>
    // </PageLayout>
  );
}