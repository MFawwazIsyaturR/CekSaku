import { useTypedSelector } from "../app/hook";

export const useAuth = () => {
    const { user, accessToken } = useTypedSelector((state) => state.auth);

    return {
        user,
        isAuthenticated: !!accessToken,
        isAdmin: user?.role === "admin",
    };
};
