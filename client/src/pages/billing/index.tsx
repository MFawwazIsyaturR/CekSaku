import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React, { useState } from "react";

/* =========================================================
   ============= PENGGANTI UNTUK KOMPONEN LAYOUT ==========
   =========================================================
   Komponen PageLayout dan PageHeader bersifat sementara
   sebagai pengganti jika versi asli belum tersedia.
   Fungsinya untuk membungkus halaman dan menampilkan judul.
*/

// Layout sederhana agar konten berada di tengah
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto py-8 px-4">{children}</div>
);

// Header sederhana untuk menampilkan judul halaman
const PageHeader = ({ title }: { title: string }) => (
  <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
);

/* =========================================================
   ================== DEFINISI TIPE DATA ===================
   =========================================================
   Tipe `PlanFeature` merepresentasikan satu fitur dalam paket.
   Fitur bisa memiliki catatan tambahan (footnote) dan status negatif
   jika tidak tersedia di paket tertentu.
*/
type PlanFeature = {
  text: string;        // Nama fitur
  footnote?: string;   // Catatan tambahan (opsional)
  negative?: boolean;  // Apakah fitur tidak tersedia
};

/* =========================================================
   ==================== DATA FITUR PLAN ====================
   =========================================================
   Daftar fitur yang ditawarkan tiap paket.
*/
const features: PlanFeature[] = [
  { text: "Transaksi tak terbatas" },
  { text: "Akun tak terbatas" },
  { text: "Anggaran tak terbatas" },
  { text: "Kategori tak terbatas" },
  { text: "Pemindaian struk dengan AI", footnote: "10 pemindaian per bulan" },
  { text: "Analitik lanjutan" },
  { text: "Ekspor data (CSV, PDF)" },
  { text: "Dukungan prioritas" },
];

/* =========================================================
   ====================== DATA PLAN ========================
   =========================================================
   Dua paket utama: Gratis dan Pro, lengkap dengan harga,
   fitur, dan status popularitas.
*/
const plans = [
  {
    name: "Gratis",
    price: 0,
    features: features.slice(0, 4),
    isMostPopular: false,
    isCurrent: true,
  },
  {
    name: "Pro",
    price: 19999,
    features: features,
    isMostPopular: true,
    isCurrent: false,
  },
];

/* =========================================================
   =================== KOMPONEN FITUR ======================
   =========================================================
   Menampilkan fitur dalam bentuk list dengan ikon cek/tidak.
*/
function PlanFeature({ text, footnote, negative }: PlanFeature) {
  return (
    <li className="flex items-center gap-2">
      {negative ? (
        <X className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Check className="h-4 w-4 text-primary" />
      )}
      <span className={cn("text-sm", { "text-muted-foreground": negative })}>
        {text}
      </span>
      {footnote && (
        <span className="ml-1 text-xs text-muted-foreground">({footnote})</span>
      )}
    </li>
  );
}

/* =========================================================
   =================== HALAMAN BILLING =====================
   =========================================================
   Halaman untuk menampilkan paket langganan pengguna.
   Tersedia pilihan bulanan dan tahunan dengan diskon 20%.
*/
function BillingPage() {
  // State untuk menentukan mode pembayaran: bulanan / tahunan
  const [isYearly, setIsYearly] = useState(false);

  // Fungsi toggle antara Bulanan ↔ Tahunan
  const toggleBilling = () => setIsYearly(!isYearly);

  return (
    <PageLayout>
      {/* ==================== HEADER HALAMAN ==================== */}
      <PageHeader title="Tingkatkan paket Anda" />
      <p className="text-muted-foreground -mt-4 mb-6">
        Pilih paket yang sesuai dengan kebutuhanmu dan dapatkan fitur Pro
      </p>

      {/* ==================== TOGGLE PLAN ==================== */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-center">
          {/* Tombol toggle antara Bulanan dan Tahunan */}
          <div
            onClick={toggleBilling}
            className="inline-flex cursor-pointer items-center rounded-full p-1"
          >
            <Button
              variant={!isYearly ? "default" : "ghost"}
              size="lg"
              className="rounded-full"
            >
              Bulanan
            </Button>
            <Button
              variant={isYearly ? "default" : "ghost"}
              size="lg"
              className="rounded-full"
            >
              Tahunan
            </Button>
          </div>
        </div>

        {/* ==================== GRID PLAN ==================== */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn("flex flex-col", {
                "border-2 border-primary shadow-lg": plan.isMostPopular,
              })}
            >
              {/* ===== HEADER KARTU PLAN ===== */}
              <CardHeader className="relative">
                {plan.isMostPopular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2">
                    Paling Populer
                  </Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">
                    {isYearly
                      ? `Rp${(plan.price * 12).toLocaleString("id-ID")}`
                      : `Rp${plan.price.toLocaleString("id-ID")}`}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.price > 0 ? (isYearly ? "/tahun" : "/bulan") : ""}
                  </span>
                </CardDescription>
              </CardHeader>

              {/* ===== DAFTAR FITUR PLAN ===== */}
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <PlanFeature key={feature.text} {...feature} />
                  ))}

                  {/* Fitur tidak tersedia di Free plan */}
                  {plan.name === "Gratis" &&
                    features
                      .slice(4)
                      .map((feature) => (
                        <PlanFeature
                          key={feature.text}
                          {...feature}
                          negative
                        />
                      ))}
                </ul>
              </CardContent>

              {/* ===== TOMBOL ACTION ===== */}
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={plan.isCurrent}
                  variant={plan.isMostPopular ? "default" : "outline"}
                >
                  {plan.isCurrent
                    ? "Paket Saat Ini"
                    : plan.name === "Gratis"
                    ? "Downgrade"
                    : "Upgrade ke Pro"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default BillingPage;
