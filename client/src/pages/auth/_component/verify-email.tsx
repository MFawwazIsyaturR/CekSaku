import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { toast } from "sonner";
import { useVerifyRegistrationOTPMutation, useSendRegistrationOTPMutation } from "@/features/auth/authAPI";
import { Loader } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState("");
  const [verifyRegistrationOTP, { isLoading: isVerifying }] = useVerifyRegistrationOTPMutation();
  const [sendRegistrationOTP, { isLoading: isSendingOTP }] = useSendRegistrationOTPMutation();
  const navigate = useNavigate();

  if (!email) {
    // If no email in params, redirect to register page
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Silakan masukkan kode OTP 6 digit yang benar");
      return;
    }

    try {
      const result = await verifyRegistrationOTP({ email, token: otp }).unwrap();
      toast.success("Email berhasil diverifikasi!");
      setTimeout(() => navigate(PROTECTED_ROUTES.OVERVIEW), 1000);
    } catch (error) {
      toast.error("Kode OTP tidak valid atau sudah kadaluarsa");
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendRegistrationOTP({ email }).unwrap();
      toast.success("Kode OTP baru telah dikirim ke email Anda");
    } catch (error) {
      toast.error("Gagal mengirim ulang kode OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 via-black to-black backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Verifikasi Email</h1>
          <p className="text-sm text-gray-400 mt-2">
            Kami telah mengirimkan kode verifikasi ke {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            disabled={isVerifying || otp.length !== 6}
            type="submit"
            className="w-full bg-gradient-to-r from-white to-gray-300 text-black font-semibold py-2 rounded-xl hover:opacity-70 hover:cursor-pointer transition"
          >
            {isVerifying && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Verifikasi Email
          </Button>

          <div className="text-center text-sm text-gray-400">
            Belum menerima kode?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isSendingOTP}
              className="text-white font-semibold hover:underline disabled:opacity-50"
            >
              {isSendingOTP ? "Mengirim..." : "Kirim Ulang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;