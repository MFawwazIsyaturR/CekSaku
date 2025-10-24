import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// Data untuk kartu harga (hanya Free dan Pro)
const plans = [
  {
    name: "Gratis",
    id: "free",
    price: { monthly: "Rp 0", annually: "Rp 0" },
    priceSuffix: "selamanya",
    description: "Fitur dasar untuk memulai mengelola keuangan Anda.",
    cta: "Mulai Gratis",
    isFeatured: false,
    features: [
      "Batas 30 transaksi per bulan",
      "Analisis Dashboard Dasar",
      "Laporan Bulanan Standar",
      "Impor & Ekspor CSV",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    price: { monthly: "Rp 19.999", annually: "Rp 199.000" },
    originalPrice: { monthly: "Rp 29.000", annually: "Rp 299.000" },
    priceSuffix: { monthly: "per bulan", annually: "per tahun" },
    description: "Fitur lanjutan dengan kekuatan AI untuk analisis mendalam.",
    cta: "Mulai Uji Coba Gratis",
    isFeatured: true,
    features: [
      "Semua di paket Free, plus:",
      "Transaksi Tanpa Batas",
      "Pemindai Struk AI",
      "Wawasan Keuangan Berbasis AI",
    ],
  },
];

// Data untuk tabel perbandingan fitur
const featureComparison = [
  { feature: "Batas Transaksi", free: "30 transaksi / bulan", pro: "Tanpa Batas" },
  { feature: "Lacak Pemasukan & Pengeluaran", free: true, pro: true },
  { feature: "Analisis Dashboard", free: "Dasar", pro: "Lanjutan" },
  { feature: "Pemindai Struk AI", free: false, pro: true },
  { feature: "Wawasan Keuangan AI", free: false, pro: true },
  { feature: "Laporan Bulanan Otomatis", free: true, pro: true },
  { feature: "Impor & Ekspor CSV", free: true, pro: true },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  return (
    <section
      id="pricing"
      className="relative py-16 sm:py-24 text-white overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-transparent via-blue-900/30 to-transparent z-0 opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <ScrollReveal>
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400 mb-4 bg-blue-500/10 inline-block px-3 py-1 rounded-full">
            Harga
          </h2>
          {/* Ukuran font sudah responsif dengan sm: prefix */}
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl hero-title-gradient">
            Pilih Paket <br /> Sesuai Kebutuhan Anda
          </p>
          {/* Penyesuaian ukuran font dan leading untuk mobile */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-gray-300">
            Mulai gratis untuk kebutuhan dasar, atau upgrade ke Pro untuk
            membuka semua potensi CekSaku.
          </p>
        </div>

        {/* Toggle Bulanan/Tahunan */}
        <div className="mt-16 flex justify-center items-center space-x-4">
          <Label
            htmlFor="billing-cycle"
            className={cn(
              "text-sm font-medium",
              billingCycle === "monthly" ? "text-white" : "text-gray-400"
            )}
          >
            Bulanan
          </Label>
          <Switch
            id="billing-cycle"
            checked={billingCycle === "annually"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "annually" : "monthly")
            }
            className="data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-700 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 [&>span]:translate-x-0 data-[state=checked]:[&>span]:translate-x-5"
          >
            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
          </Switch>
          <Label
            htmlFor="billing-cycle"
            className={cn(
              "text-sm font-medium",
              billingCycle === "annually" ? "text-white" : "text-gray-400"
            )}
          >
            Tahunan
          </Label>
          <span className="ml-2 inline-flex items-center rounded-full bg-blue-900/50 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
            Hemat 35%
          </span>
        </div>

        {/* Kartu Harga */}
        {/* Penyesuaian grid gap untuk mobile */}
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-300 ease-in-out",
                "bg-gradient-to-b from-gray-900/70 via-gray-900/70 to-black backdrop-blur-sm ring-1 ring-white/10",
                plan.isFeatured &&
                  "ring-2 ring-blue-500/80 shadow-2xl shadow-blue-500/20"
              )}
            >
              {plan.isFeatured && (
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-500/30 to-black blur-2xl opacity-60"></div>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {" "}
                {/* Flex column untuk layout internal */}
                <div>
                  {" "}
                  {/* Wrapper untuk konten atas */}
                  <h3 className="text-4xl font-semibold leading-8 text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-300">
                    {plan.description}
                  </p>
                  <p className="mt-8 flex items-baseline gap-x-1">
                    <div className=" flex flex-col items-start space-y-2">
                      {plan.originalPrice &&
                        plan.originalPrice[billingCycle] && (
                          <span className="text-base text-gray-400 line-through">
                            {plan.originalPrice[billingCycle]}
                          </span>
                        )}
                      <div className="flex items-baseline gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-white">
                          {plan.price[billingCycle]}
                        </span>
                        <span className="text-sm font-semibold text-gray-300">
                          {typeof plan.priceSuffix === "string"
                            ? plan.priceSuffix
                            : plan.priceSuffix[billingCycle]}
                        </span>
                      </div>
                    </div>
                  </p>
                  <Link
                    to={AUTH_ROUTES.SIGN_UP}
                    aria-describedby={`plan-${plan.name}`}
                    className={cn(
                      "mt-6 block rounded-full py-3 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-200",
                      plan.isFeatured
                        ? "bg-white text-black shadow-sm hover:bg-white/80 focus-visible:outline-blue-600"
                        : "bg-white text-black hover:bg-white/80 focus-visible:outline-white"
                    )}
                  >
                    {plan.cta}
                  </Link>
                  <p className="mt-3 text-xs text-gray-500">
                    {billingCycle === "monthly"
                      ? "Ditagih bulanan"
                      : "Ditagih tahunan"}
                  </p>
                </div>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10 flex-grow"
                >
                  {" "}
                  {/* flex-grow agar fitur mengisi ruang */}
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-start">
                      {" "}
                      {/* items-start agar check sejajar dengan baris pertama teks panjang */}
                      <Check
                        className="h-5 w-4 flex-none text-blue-400 mt-1"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        </ScrollReveal>

<ScrollReveal>
        {/* Tabel Perbandingan Fitur */}
        <div className="mt-50">
          <h3 className="text-4xl font-bold text-center mb-10 hero-title-gradient">
            Perbandingan Fitur
          </h3>
          {/* Tampilan Tabel untuk Desktop */}
          <div className="hidden lg:block">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-white/10">
  <tr>
    <th className="py-4 pr-4 font-semibold text-lg w-2/5">Fitur</th>
    <th className="py-4 px-4 font-semibold text-lg text-center border-l border-white/10 border-t-0">
      Gratis
    </th>
    <th className="py-4 pl-4 font-semibold text-lg text-center border-l border-white/10 border-t-0 border-r-0">
      Pro
    </th>
  </tr>
</thead>

              <tbody className="divide-y divide-white/10">
  {featureComparison.map((item) => (
    <tr key={item.feature}>
      <td className="py-4 pr-4 align-top text-gray-300">{item.feature}</td>

      <td className="py-4 px-4 align-top text-center border-l border-white/10">
        {typeof item.free === "boolean" ? (
          item.free ? (
            <Check className="h-6 w-6 text-blue-400 mx-auto" />
          ) : (
            <X className="h-6 w-6 text-gray-500 mx-auto" />
          )
        ) : (
          <span className="text-gray-300">{item.free}</span>
        )}
      </td>

      <td className="py-4 pl-4 align-top text-center border-l border-white/10">
        {typeof item.pro === "boolean" ? (
          item.pro ? (
            <Check className="h-6 w-6 text-blue-400 mx-auto" />
          ) : (
            <X className="h-6 w-6 text-gray-500 mx-auto" />
          )
        ) : (
          <span className="text-white font-semibold">{item.pro}</span>
        )}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
          

          {/* Tampilan Daftar Kartu untuk Mobile/Tablet */}
          <div className="space-y-4 lg:hidden">
            {featureComparison.map((item) => (
              <div
                key={item.feature}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <h4 className="font-semibold text-white mb-3">
                  {item.feature}
                </h4>
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <span className="text-gray-400">Gratis</span>
                  {typeof item.free === "boolean" ? (
                    item.free ? (
                      <Check className="h-5 w-5 text-blue-400" />
                    ) : (
                      <X className="h-5 w-5 text-gray-500" />
                    )
                  ) : (
                    <span className="text-gray-300 text-right">
                      {item.free}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Pro</span>
                  {typeof item.pro === "boolean" ? (
                    item.pro ? (
                      <Check className="h-5 w-5 text-blue-400" />
                    ) : (
                      <X className="h-5 w-5 text-gray-500" />
                    )
                  ) : (
                    <span className="text-white font-semibold text-right">
                      {item.pro}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PricingSection;
