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
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useCreateSubscriptionPaymentMutation } from "@/features/payment/paymentAPI";
import { updateCredentials } from "@/features/auth/authSlice";

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
// Define the type for our plans
interface Plan {
  name: string;
  price: number;  // Monthly price
  originalPrice?: number;
  yearlyPrice?: number;  // Yearly price without discount
  features: PlanFeature[];
  isMostPopular: boolean;
  isCurrent: boolean;
}

const plans: Plan[] = [
  {
    name: "Gratis",
    price: 0,
    features: features.slice(0, 4),
    isMostPopular: false,
    isCurrent: false, // This will be determined dynamically
  },
  {
    name: "Pro",
    price: 19999,
    originalPrice: 19999,
    yearlyPrice: 19999 * 12, // Yearly price without discount
    features: features,
    isMostPopular: true,
    isCurrent: false, // This will be determined dynamically
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);

  const [createSubscriptionPayment, { isLoading: isCreatingPayment }] = useCreateSubscriptionPaymentMutation();

  // Fungsi toggle antara Bulanan ↔ Tahunan
  const toggleBilling = () => setIsYearly(!isYearly);

  const handlePayment = async (plan: typeof plans[0]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Double-check that user exists, in case the UI state wasn't accurate
      if (!user?.id) {
        setError('User not authenticated. Please log in first.');
        setIsLoading(false);
        return;
      }

      // Calculate the actual price based on billing cycle (monthly vs yearly)
      const price = isYearly 
        ? (plan.yearlyPrice || plan.price * 12) 
        : plan.price;
      const period = isYearly ? 'tahun' : 'bulan';
      const planName = `${plan.name} Plan ${isYearly ? '(Tahunan)' : '(Bulanan)'}`;

      // Validate that required fields are not empty/null
      if (!price || price <= 0) {
        setError('Invalid price for the selected plan.');
        setIsLoading(false);
        return;
      }

      // Use user ID
      const userId = user?.id;

      const response = await createSubscriptionPayment({
        userId: userId!,
        plan: planName,
        price: price,
        currency: 'IDR'
      }).unwrap();

      const { token } = response;

      // Load Midtrans SNAP script dynamically
      const script = document.createElement('script');
      // Use VITE environment variables (Vite uses VITE_ prefix)
      script.src = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');

      script.onload = () => {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            alert('Payment successful!');
            // Update the user's subscription status in the store
            if (user) {
              dispatch(updateCredentials({
                user: {
                  ...user,
                  subscriptionStatus: 'active',
                  subscriptionPlan: 'Pro',
                  subscriptionOrderId: result.order_id || null,
                }
              }));
            }
            setIsLoading(false);
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            alert('Payment pending, please complete the transaction');
            setIsLoading(false);
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            alert('Payment failed, please try again');
            setIsLoading(false);
          },
          onClose: function() {
            console.log('Customer closed the popup');
            setIsLoading(false);
          }
        });
      };

      document.body.appendChild(script);

    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDowngrade = () => {
    // In this implementation, the free tier is automatic
    // In a real-world scenario, you might want to have actual downgrade functionality
    alert("You are already on the free plan.");
  };

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
          {plans.map((plan) => {
            // Determine if this plan is the user's current plan based on subscription status
            const isCurrentProPlan = user && user.subscriptionStatus === 'active' && plan.name === 'Pro';
            const isCurrentFreePlan = (!user || !user.subscriptionStatus || user.subscriptionStatus === 'pending' || user.subscriptionStatus === 'cancelled' || user.subscriptionStatus === 'expired') && plan.name === 'Gratis';
            const isCurrentPlan = isCurrentProPlan || isCurrentFreePlan;

            return (
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
                      ? `Rp${(plan.yearlyPrice || plan.price * 12).toLocaleString("id-ID")}`
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
                  disabled={isCurrentPlan || isLoading || (plan.name === "Pro" && !user?.id)}
                  variant={plan.isMostPopular ? "default" : "outline"}
                  onClick={plan.name === "Pro" ? () => handlePayment(plan) : 
                           plan.name === "Gratis" ? () => handleDowngrade() : undefined}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isCurrentPlan
                        ? "Paket Saat Ini"
                        : plan.name === "Gratis"
                        ? "Downgrade"
                        : "Upgrade ke Pro"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )})}
        </div>

        {error && (
          <div className="mt-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Show a message if user is not authenticated */}
        {!user?.id && plans.some(p => p.name === "Pro") && (
          <div className="mt-4 p-4 text-center bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">Silakan login terlebih dahulu untuk mengupgrade ke paket Pro</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default BillingPage;
