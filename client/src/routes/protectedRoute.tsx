import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath";

const ProtectedRoute = () => {
  // Mengambil state otentikasi dari Redux store
  const { accessToken, user } = useTypedSelector((state) => state.auth);

  // Jika ada token akses dan informasi pengguna, izinkan akses ke rute terlindungi
  if (accessToken && user) {
    return <Outlet />;
  }

  // Jika tidak ada, arahkan pengguna ke landing page
  return <Navigate to={AUTH_ROUTES.LANDING} replace />
};

export default ProtectedRoute;