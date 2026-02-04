import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTypedSelector } from "@/app/hook";
import { useAppDispatch } from "@/app/hook";
import { useCancelSubscriptionMutation } from "@/features/payment/paymentAPI";
import { updateCredentials } from "@/features/auth/authSlice";

export default function PaymentManagement() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [isCancellingApi, setIsCancellingApi] = useState(false);

  const handleCancelSubscription = async () => {
    if (!user?.subscriptionOrderId) {
      alert("Tidak ada langganan aktif untuk dibatalkan");
      return;
    }

    setIsCancellingApi(true);
    try {
      await cancelSubscription({ orderId: user.subscriptionOrderId }).unwrap();
      // Update user subscription status in the store
      dispatch(updateCredentials({
        user: {
          ...user,
          subscriptionStatus: 'cancelled',
          subscriptionPlan: 'free',
          subscriptionOrderId: user.subscriptionOrderId
        }
      }));
      alert("Langganan berhasil dibatalkan");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Gagal membatalkan langganan");
    } finally {
      setIsCancellingApi(false);
    }
  };

  // Determine subscription status
  const isSubscribed = user?.subscriptionStatus === 'active';
  const isCancelled = user?.subscriptionStatus === 'cancelled';
  const isExpired = user?.subscriptionStatus === 'expired' || (user?.subscriptionExpiredAt && new Date(user.subscriptionExpiredAt) < new Date());
  const isPending = user?.subscriptionStatus === 'pending';

  // Map Midtrans payment_type to readable names
  const getPaymentMethodName = (type?: string) => {
    if (!type) return "Tidak diketahui";

    // Handle granular bank transfers
    if (type.startsWith("bank_transfer:")) {
      const bank = type.split(":")[1].toUpperCase();
      return `Transfer Bank (${bank})`;
    }

    const methods: Record<string, string> = {
      credit_card: "Kartu Kredit/Debit",
      gopay: "GoPay",
      shopeepay: "ShopeePay",
      bank_transfer: "Bank Transfer",
      echannel: "Mandiri Bill Payment",
      bca_klikpay: "BCA KlikPay",
      bripay: "BRImo",
      cimb_clicks: "CIMB Clicks",
      danamon_online: "Danamon Online Banking",
      qris: "QRIS",
      akulaku: "Akulaku",
      kredivo: "Kredivo",
      indomaret: "Indomaret",
      alfamart: "Alfamart",
    };
    return methods[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manajemen Pembayaran</h3>
        <p className="text-sm text-muted-foreground">
          Lihat dan kelola langganan Anda serta metode pembayaran.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader className="grid grid-cols-2 gap-4">
          <div>
            <CardTitle>Detail Langganan</CardTitle>
            <CardDescription>
              Informasi tentang paket langganan Anda
            </CardDescription>
          </div>
          <div className="flex flex-col justify-center items-end">
            <div>
              <h4 className="font-semibold">
                {isSubscribed ? "Langganan Pro Aktif" : isPending ? "Menunggu Pembayaran" : isCancelled ? "Langganan Dibatalkan" : isExpired ? "Langganan Kadaluarsa" : "Tidak Berlangganan"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {user?.subscriptionPlan || "Gratis"}
              </p>
              {user?.subscriptionExpiredAt && (
                <p className="text-sm text-muted-foreground">
                  Berakhir pada: {new Date(user?.subscriptionExpiredAt).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
            <Badge
              variant={
                isSubscribed ? "default" :
                  isPending ? "outline" :
                    isCancelled ? "secondary" :
                      isExpired ? "destructive" :
                        "secondary"
              }
            >
              {isSubscribed ? "Aktif" : isPending ? "Menunggu" : isCancelled ? "Dibatalkan" : isExpired ? "Kadaluarsa" : "Gratis"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Metode Pembayaran:</span>
              <span className="text-sm text-muted-foreground">
                {(isSubscribed || isPending) ? getPaymentMethodName(user?.subscriptionPaymentType) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tanggal Pembayaran Berikutnya:</span>
              <span className="text-sm text-muted-foreground">
                {isSubscribed && user?.subscriptionExpiredAt ? new Date(user?.subscriptionExpiredAt).toLocaleDateString("id-ID") : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Paket:</span>
              <span className="text-sm text-muted-foreground">{user?.subscriptionPlan || "Gratis"}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-4">
          {(isSubscribed || isPending) && (
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelling || isCancellingApi}
            >
              {isCancelling || isCancellingApi ? "Membatalkan..." : "Batalkan Langganan"}
            </Button>
          )}
          {(isCancelled || isExpired) && (
            <Button onClick={() => window.location.href = "/billing"}>
              Perbarui Langganan
            </Button>
          )}
        </CardFooter>
      </Card>

      {!(isSubscribed || isPending) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Buka Potensi Penuh dengan Pro</CardTitle>
            <CardDescription>
              Nikmati fitur tak terbatas dan pemindaian struk dengan AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                Transaksi Tak Terbatas
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                Akun Tak Terbatas
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                Laporan PDF & Excel
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">✓</Badge>
                Pemindaian Struk AI
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.href = "/billing"} className="w-full">
              Upgrade ke Pro Sekarang
            </Button>
          </CardFooter>
        </Card>
      )}

      {isPending && (
        <Badge variant="outline" className="mb-4">
          Pembayaran Sedang Diproses
        </Badge>
      )}
    </div>
  );
}