// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader } from "lucide-react";
import {
  useRegisterMutation,
  useGoogleLoginMutation,
} from "@/features/auth/authAPI";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const schema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak cocok",
  });

type FormValues = z.infer<typeof schema>;

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLoginMutation, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

const handleGoogleLoginClick = () => {
  const state = uuidv4(); // Generate state unik
  localStorage.setItem('oauth_state', state); // Simpan state

  // Bangun URL otentikasi Google DENGAN state
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&state=${state}`; // Tambahkan &state=${state}

  window.location.assign(googleAuthUrl); // Redirect pengguna
};

const handleGitHubLoginClick = () => {
    const state = uuidv4();
    localStorage.setItem('oauth_state', state);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}&scope=read:user%20user:email&state=${state}`; // Tambahkan &state=${state}

    window.location.assign(githubAuthUrl);
  };

  const onSubmit = (values: FormValues) => {
    register(values)
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
        toast.success("Pendaftaran berhasil");
        setTimeout(() => navigate(PROTECTED_ROUTES.OVERVIEW), 1000);
      })
      .catch((error) => {
        toast.error(error.data?.message || "Gagal mendaftar");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 via-black to-black backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Daftar Akun</h1>
          <p className="text-sm text-gray-400 mt-2">
            Buat akun baru dan mulai petualanganmu 🚀
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm">
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Nama Lengkap"
                      {...field}
                      className="text-white rounded-xl focus:ring-2 focus:ring-gray-600 border-none
               focus-visible:ring-0 
               focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan Email"
                      {...field}
                      className="text-white rounded-xl focus:ring-2 focus:ring-gray-600 border-none
               focus-visible:ring-0 
               focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Masukkan password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="text-white rounded-xl focus:ring-2 focus:ring-gray-600 pr-10 border-none
               focus-visible:ring-0 
               focus-visible:ring-offset-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 text-sm">
                    Konfirmasi Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Masukkan ulang password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className=" text-white rounded-xl focus:ring-2 focus:ring-gray-600 pr-10 border-none
               focus-visible:ring-0 
               focus-visible:ring-offset-0"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
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

            {/* Submit Button */}
            <Button
              disabled={isLoading || isGoogleLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-white to-gray-300 text-black font-semibold py-2 rounded-xl hover:opacity-70 hover:cursor-pointer transition"
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Daftar
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-400">
              Sudah punya akun?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="text-white font-semibold hover:underline"
              >
                Masuk
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0F0F0F]/70 px-2 text-gray-400">
                  atau daftar dengan
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="group w-full flex items-center justify-center gap-2 bg-[#1A1A1A] border-gray-700 hover:bg-white hover:cursor-pointer text-white rounded-xl transition"
                onClick={() => handleGoogleLoginClick()}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-colors duration-300"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="fill-[#4285F4] group-hover:fill-black"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="fill-[#34A853] group-hover:fill-black"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      className="fill-[#FBBC05] group-hover:fill-black"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="fill-[#EA4335] group-hover:fill-black"
                    />
                  </svg>
                )}
                Google
              </Button>

              {/* GitHub */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] border-gray-700 hover:bg-white hover:cursor-pointer text-white rounded-xl transition"
                onClick={handleGitHubLoginClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="text-[11px] text-gray-500 text-center mt-3 leading-relaxed">
              ⚠️ Jika Anda ingin daftar menggunakan GitHub, pastikan opsi{" "}
              <span className="text-white font-semibold">
                “Keep my email addresses private”
              </span>{" "}
              dimatikan di akun GitHub Anda.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

const SignUpForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <p className="text-red-500 text-center font-bold">
        Error Konfigurasi: VITE_GOOGLE_CLIENT_ID belum diatur di file .env
        frontend.
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className={className} {...props}>
        <RegisterForm />
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpForm;
