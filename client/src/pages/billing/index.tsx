import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useCreateSubscriptionPaymentMutation, useCancelSubscriptionMutation } from "@/features/payment/paymentAPI";
import { updateCredentials } from "@/features/auth/authSlice";

/* =========================================================
   ================== DEFINISI TIPE DATA ===================
   =========================================================
*/
type PlanFeature = {
  text: string;
  footnote?: string;
  negative?: boolean;
};

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  badge: string;
  features: PlanFeature[];
  isHighlighted: boolean;
}

const originalFeatures: PlanFeature[] = [
  { text: "Transaksi tak terbatas" },
  { text: "Akun tak terbatas" },
  { text: "Anggaran tak terbatas" },
  { text: "Kategori tak terbatas" },
  { text: "Pemindaian struk dengan AI", footnote: "10 pemindaian per bulan" },
  { text: "Analitik lanjutan" },
  { text: "Ekspor data (CSV, PDF)" },
  { text: "Dukungan prioritas" },
];

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    badge: "FREE",
    features: originalFeatures.slice(0, 4),
    isHighlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19999,
    yearlyPrice: 19999 * 12 * 0.8, // 20% discount
    badge: "PRO",
    features: originalFeatures,
    isHighlighted: true,
  },
];

/* =========================================================
   ==================== KOMPONEN RIVET =====================
   =========================================================
*/
const Rivet = ({ className }: { className: string }) => (
  <div className={cn("absolute w-1.5 h-1.5 rounded-full border border-gray-400/20 opacity-30", className)} />
);

function BillingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const [createSubscriptionPayment] = useCreateSubscriptionPaymentMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  const toggleBilling = () => setIsYearly(!isYearly);

  const handlePayment = async (plan: Plan) => {
    if (plan.id === 'free') return;
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.id) {
        setError('User not authenticated. Please log in first.');
        setIsLoading(false);
        return;
      }
      const price = isYearly ? (plan.yearlyPrice || plan.price * 12) : plan.price;
      const planName = `${plan.name} Plan ${isYearly ? '(Tahunan)' : '(Bulanan)'}`;
      const response = await createSubscriptionPayment({
        userId: user.id,
        plan: planName,
        price: price,
        currency: 'IDR'
      }).unwrap();
      const { token } = response;
      const script = document.createElement('script');
      script.src = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
      script.onload = () => {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function (result: any) {
            dispatch(updateCredentials({
              user: { ...user, subscriptionStatus: 'active', subscriptionPlan: 'Pro', subscriptionOrderId: result.order_id || null }
            }));
            setIsLoading(false);
          },
          onPending: () => setIsLoading(false),
          onError: () => setIsLoading(false),
          onClose: () => setIsLoading(false)
        });
      };
      document.body.appendChild(script);
    } catch (err) {
      setError('Gagal memproses pembayaran.');
      setIsLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!user?.subscriptionOrderId) return;
    if (!confirm("Apakah Anda yakin ingin membatalkan langganan Pro?")) return;
    setIsLoading(true);
    try {
      await cancelSubscription({ orderId: user.subscriptionOrderId }).unwrap();
      dispatch(updateCredentials({
        user: { ...user, subscriptionStatus: 'cancelled', subscriptionPlan: 'free' }
      }));
    } catch (err) {
      setError('Gagal membatalkan langganan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground leading-relaxed">
          Pilih paket yang sesuai dengan kebutuhanmu dan dapatkan fitur Pro
        </p>
      </div>

      {/* Toggle Bulanan / Tahunan */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex p-1 bg-muted rounded-full border border-border">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200",
              !isYearly ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Bulanan
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2",
              isYearly ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Tahunan
            <Badge className="bg-primary text-white border-none text-[10px] py-0 px-1.5 h-4">
              -20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isPro = plan.id === 'pro';
          const isActive = user?.subscriptionStatus === 'active';
          const isUserPlan = (isPro && isActive) || (!isPro && !isActive);
          const currentPrice = isYearly ? (plan.yearlyPrice || plan.price * 12) : plan.price;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col border shadow-sm transition-all duration-300",
                plan.isHighlighted
                  ? "bg-primary text-primary-foreground border-transparent shadow-lg scale-[1.02]"
                  : "bg-card text-card-foreground border-border"
              )}
            >
              {/* Rivets */}
              <Rivet className="top-3 left-3" />
              <Rivet className="top-3 right-3" />
              <Rivet className="bottom-3 left-3" />
              <Rivet className="bottom-3 right-3" />

              {/* Card Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold uppercase tracking-tight">{plan.name} Plan</h3>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border",
                  plan.isHighlighted
                    ? "bg-white/20 text-white border-white/20"
                    : "bg-muted text-foreground border-border"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", plan.isHighlighted ? "bg-white animate-pulse" : "bg-primary")} />
                  {plan.badge}
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  Rp{Math.floor(currentPrice).toLocaleString('id-ID')}
                </span>
                <span className={cn("text-sm font-medium", plan.isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {isYearly ? "/tahun" : "/bulan"}
                </span>
              </div>

              {/* Action Button */}
              <div className="mb-8">
                <Button
                  disabled={isUserPlan || isLoading}
                  variant={plan.isHighlighted ? "secondary" : "outline"}
                  onClick={() => (isPro ? handlePayment(plan) : handleDowngrade())}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm",
                    plan.isHighlighted
                      ? "bg-white text-primary hover:bg-gray-100"
                      : "bg-muted text-foreground hover:bg-gray-200"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      {isUserPlan ? "Paket Saat Ini" : isPro ? "Upgrade Plan" : "Downgrade"}
                      {!isUserPlan && <ArrowRight className="h-4 w-4" />}
                    </>
                  )}
                </Button>
              </div>

              {/* Features List */}
              <ul className="space-y-4 pt-4 border-t border-current/10">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                      plan.isHighlighted ? "border-white/30 text-white" : "border-border text-primary"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{feature.text}</span>
                      {feature.footnote && (
                        <span className={cn("text-[10px] font-medium opacity-70", plan.isHighlighted ? "text-white/80" : "text-muted-foreground")}>
                          ({feature.footnote})
                        </span>
                      )}
                    </div>
                  </li>
                ))}

                {plan.id === 'free' && (
                  <li className="flex items-start gap-3 opacity-20 select-none">
                    <div className="mt-0.5 w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                      <X className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-semibold">Fitur Pro Lainnya...</span>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center text-sm font-bold animate-in fade-in">
          {error}
        </div>
      )}
    </div>
  );
}

export default BillingPage;
