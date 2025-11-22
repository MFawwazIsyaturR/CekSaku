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
                {isSubscribed ? "Langganan Pro Aktif" : isCancelled ? "Langganan Dibatalkan" : isExpired ? "Langganan Kadaluarsa" : "Tidak Berlangganan"}
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
                isCancelled ? "secondary" : 
                isExpired ? "destructive" : 
                "outline"
              }
            >
              {isSubscribed ? "Aktif" : isCancelled ? "Dibatalkan" : isExpired ? "Kadaluarsa" : "Gratis"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Metode Pembayaran:</span>
              <span className="text-sm text-muted-foreground">•••• •••• •••• 4242</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tanggal Pembayaran Berikutnya:</span>
              <span className="text-sm text-muted-foreground">
                {user?.subscriptionExpiredAt ? new Date(user?.subscriptionExpiredAt).toLocaleDateString("id-ID") : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jenis Pembayaran:</span>
              <span className="text-sm text-muted-foreground">Tahunan</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start gap-4">
          {isSubscribed && (
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

      <Card>
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
          <CardDescription>
            Metode pembayaran yang digunakan untuk pembayaran otomatis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              <p className="font-medium">Kartu Visa</p>
              <p className="text-sm text-muted-foreground">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Berlaku hingga 12/2027</p>
            </div>
          </div>
          <Button variant="outline">Kelola</Button>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            + Tambahkan Metode Pembayaran Baru
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}