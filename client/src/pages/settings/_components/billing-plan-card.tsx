import { useCreateSubscriptionPaymentMutation } from "@/features/payment/paymentAPI";
import { useTypedSelector } from "@/app/hook";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const BillingPlanCard = () => {
  // 1. Ambil data user untuk mendapatkan userId
  const { user } = useTypedSelector((state) => state.auth);
  
  // 2. Inisialisasi hook mutasi pembayaran
  const [createSubscriptionPayment, { isLoading }] = useCreateSubscriptionPaymentMutation();

  // 3. Buat fungsi handler untuk tombol Upgrade
  const handleUpgradeToPro = async () => {
    try {
      // Panggil endpoint backend untuk membuat transaksi
      const response = await createSubscriptionPayment({
        userId: user?.id || '',
        plan: 'Professional Plan', // Sesuaikan dengan nama plan di backend/database
        price: 99900,              // Harga untuk Pro Plan
        currency: 'IDR'
      }).unwrap();

      const { token } = response;

      // 4. Load Script Midtrans Snap (KHUSUS SANDBOX)
      const script = document.createElement('script');
      // Gunakan URL Sandbox secara eksplisit
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
      
      script.onload = () => {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            alert('Upgrade berhasil! Akun Anda sekarang Pro.');
            // Tambahkan logika refresh halaman atau update state user di sini
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            alert('Menunggu pembayaran...');
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            alert('Pembayaran gagal, silakan coba lagi.');
          },
          onClose: function() {
            console.log('Popup ditutup');
          }
        });
      };

      document.body.appendChild(script);
      
    } catch (err) {
      console.error('Gagal upgrade:', err);
      alert('Terjadi kesalahan saat memproses upgrade.');
    }
  };

  return (
    // ... JSX Card Anda ...
    
    // 5. Cari Button "Upgrade ke pro" dan update propertinya
    <Button 
      className="w-full mt-4" // Sesuaikan styling yang ada
      onClick={handleUpgradeToPro}
      disabled={isLoading} // Tombol aktif (kecuali sedang loading), jangan di-hardcode disabled
    >
      {isLoading ? "Memproses..." : "Upgrade ke Pro"}
    </Button>
    
    // ...
  );
};

