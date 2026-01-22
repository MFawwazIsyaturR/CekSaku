import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath";

const AuthRoute = () => {
    const { accessToken, user } = useTypedSelector((state) => state.auth)

    if (!accessToken && !user) return <Outlet />;

    const destination = user?.role === "admin"
        ? PROTECTED_ROUTES.ADMIN_DASHBOARD
        : PROTECTED_ROUTES.OVERVIEW;

    return <Navigate to={destination} replace />;
};

export default AuthRoute;