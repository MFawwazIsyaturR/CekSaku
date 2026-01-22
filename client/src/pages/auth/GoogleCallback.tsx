import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGoogleLoginMutation } from "@/features/auth/authAPI";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { PROTECTED_ROUTES, AUTH_ROUTES } from "@/routes/common/routePath";
import { Loader } from "lucide-react";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [googleLoginCallback] = useGoogleLoginMutation();

  //  ref untuk melacak apakah proses sudah dijalankan
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Hanya proses jika belum pernah dijalankan sebelumnya
    if (hasProcessed.current) {
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = localStorage.getItem('oauth_state');
    localStorage.removeItem('oauth_state');

    if (!code || !state || !storedState || state !== storedState) {
      toast.error("Otentikasi Google gagal: State tidak cocok atau hilang.");
      navigate(AUTH_ROUTES.SIGN_IN, { replace: true });
      hasProcessed.current = true; // Tandai sudah diproses (meskipun gagal)
      return;
    }

    // Tandai sudah diproses SEBELUM memanggil backend
    hasProcessed.current = true;

    // Jika state valid, kirim code ke backend
    googleLoginCallback({ code })
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
        toast.success("Masuk dengan Google berhasil");

        const destination = data.user?.role === "admin"
          ? PROTECTED_ROUTES.ADMIN_DASHBOARD
          : PROTECTED_ROUTES.OVERVIEW;

        // Timeout kecil untuk memastikan state Redux terupdate sebelum navigasi
        setTimeout(() => navigate(destination, { replace: true }), 100);
      })
      .catch((error) => {
        console.error("Login Google Callback Gagal", error);
        toast.error(error.data?.message || "Gagal memproses login Google.");
        navigate(AUTH_ROUTES.SIGN_IN, { replace: true });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate, dispatch, googleLoginCallback]); // Hapus 'hasProcessed' dari dependency array

  // Tampilkan loading indicator selama proses backend berjalan
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="h-8 w-8 animate-spin" />
      <p className="ml-4">Memproses login Google...</p>
    </div>
  );
};

export default GoogleCallback;