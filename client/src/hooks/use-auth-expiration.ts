import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateCredentials } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/features/auth/authAPI";

const useAuthExpiration = () => {
  const {
    accessToken,
    expiresAt,
  } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshMutation()

  useEffect(() => {
    const handleLogout = () => {
      console.log("Token expired, logging out...");
      dispatch(logout());
    };

    const handleTokenRefresh = async () => {
        try {
          const {accessToken, expiresAt} = await refreshToken({}).unwrap();
          dispatch(updateCredentials({accessToken, expiresAt}));
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Token refresh failed, logging out...", error);
          handleLogout();
        }
      };

    if (accessToken && expiresAt) {
        const currentTime = Date.now();
        const timeUntilExpiration = expiresAt - currentTime;
      if (timeUntilExpiration <= 0) {
        // Token is already expired, try to refresh it
        handleTokenRefresh();
      } else {
        // Set a timeout to refresh the token before it expires (1 minute before)
        const refreshTimer = setTimeout(handleTokenRefresh, timeUntilExpiration - 60000);
        // Set a timeout to log out the user when the token expires
        const logoutTimer = setTimeout(handleLogout, timeUntilExpiration);
        
        // Cleanup the timers on component unmount or token change
        return () => {
          clearTimeout(refreshTimer);
          clearTimeout(logoutTimer);
        };
      }
    }
  }, [accessToken, dispatch, expiresAt, refreshToken]);
};

export default useAuthExpiration;