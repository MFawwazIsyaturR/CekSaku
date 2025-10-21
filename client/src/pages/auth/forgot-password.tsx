import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/features/auth/authAPI";
import { Eye, EyeOff, Loader } from "lucide-react";
import Logo from "@/components/logo/logo";
import { AUTH_ROUTES } from "@/routes/common/routePath";

const emailSchema = z.object({
  email: z.string().email("Alamat email tidak valid."),
});

const resetSchema = z
  .object({
    code: z
      .string()
      .min(6, "Kode harus 6 digit.")
      .regex(/^[0-9]+$/, "Kode OTP harus berupa angka."), // <-- TAMBAHKAN INI
    password: z
      .string()
      .min(6, "Kata sandi harus terdiri dari setidaknya 6 karakter."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();
  const navigate = useNavigate();

  // State untuk visibilitas kata sandi
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const handleSendCode = (values: z.infer<typeof emailSchema>) => {
    forgotPassword(values)
      .unwrap()
      .then(() => {
        toast.success("Kode reset telah dikirim ke email Anda.");
        setUserEmail(values.email);
        setEmailSent(true);
      })
      .catch((err) =>
        toast.error(err.data?.message || "Gagal mengirim email.")
      );
  };

  const handleResetPassword = (values: z.infer<typeof resetSchema>) => {
    resetPassword({ token: values.code, password: values.password })
      .unwrap()
      .then(() => {
        toast.success("Kata sandi berhasil direset! Silakan masuk kembali.");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((err) =>
        toast.error(err.data?.message || "Gagal mereset kata sandi.")
      );
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-sm space-y-12">
        <div className="ml-32">
          <Logo url="/" />
        </div>

        {!emailSent ? (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-300">Lupa Kata Sandi?</h1>
              <p className="text-muted-foreground text-sm">
                Masukkan email Anda untuk menerima kode reset.
              </p>
            </div>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleSendCode)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
  <Input
    className="text-white border-none
               focus-visible:ring-0 
               focus-visible:ring-offset-0"
    placeholder="me@contoh.com"
    {...field}
  />
</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-white to-gray-300 text-black font-bold" disabled={isSending}>
                  {isSending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Kirim Kode
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verifikasi Kode</h1>
              <p className="text-muted-foreground text-sm">
                Kami telah mengirimkan kode 6 digit ke{" "}
                <span className="font-medium text-foreground">{userEmail}</span>
              </p>
            </div>
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(handleResetPassword)}
                className="space-y-6"
                autoComplete="off"
              >
                <div className="hidden">
                  <Input type="text" autoComplete="username" />
                  <Input type="password" autoComplete="new-password" />
                </div>
              <FormField
                control={resetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className='flex flex-col items-center'> 
                    <FormLabel>Kode Verifikasi</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        pattern="[0-9]*" // <-- UBAH JADI INI
                        inputMode="numeric"
                        autoFocus
                        autoComplete="one-time-code" 
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata Sandi Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            aria-label={
                              showPassword
                                ? "Sembunyikan kata sandi"
                                : "Tampilkan kata sandi"
                            }
                          >
                            {showPassword ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            aria-label={
                              showConfirmPassword
                                ? "Sembunyikan kata sandi"
                                : "Tampilkan kata sandi"
                            }
                          >
                            {showConfirmPassword ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-white to-gray-300 text-black font-bold" disabled={isResetting}>
                  {isResetting && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Kata Sandi
                </Button>
              </form>
            </Form>
          </div>
        )}
        <div className="text-center text-sm">
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="hover:underline underline-offset-4 text-muted-foreground"
          >
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
