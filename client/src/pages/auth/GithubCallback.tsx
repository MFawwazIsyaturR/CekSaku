import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGithubLoginMutation } from "@/features/auth/authAPI";
import { useAppDispatch } from "@/app/hook";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { PROTECTED_ROUTES, AUTH_ROUTES } from "@/routes/common/routePath";
import { Loader } from "lucide-react";

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [githubLogin] = useGithubLoginMutation();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      githubLogin({ code })
        .unwrap()
        .then((data) => {
          dispatch(setCredentials(data));
          toast.success("Masuk dengan GitHub berhasil");

          const destination = data.user?.role === "admin"
            ? PROTECTED_ROUTES.ADMIN_DASHBOARD
            : PROTECTED_ROUTES.OVERVIEW;

          navigate(destination, { replace: true });
        })
        .catch(() => {
          // toast.error("Gagal masuk dengan GitHub");
          navigate(AUTH_ROUTES.SIGN_IN, { replace: true });
        });
    } else {
      toast.error("Otentikasi GitHub gagal");
      navigate(AUTH_ROUTES.SIGN_IN, { replace: true });
    }
  }, [searchParams, navigate, dispatch, githubLogin]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="h-8 w-8 animate-spin" />
      <p className="ml-4">Sedang melakukan otentikasi dengan GitHub...</p>
    </div>
  );
};

export default GithubCallback;