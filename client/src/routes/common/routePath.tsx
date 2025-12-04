export const isAuthRoute = (pathname: string): boolean => {
    return Object.values(AUTH_ROUTES).includes(pathname);
  };
  
  export const AUTH_ROUTES = {
    LANDING: "/",
    SIGN_IN: "/login",
    SIGN_UP: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  };
  
  export const PROTECTED_ROUTES = {
    OVERVIEW: "/overview",
    TRANSACTIONS: "/transactions",
    BILLING: "/billing",
    REPORTS: "/reports",
    ASSETS: "/assets",
    SETTINGS: "/settings",
    SETTINGS_APPEARANCE: "/settings/appearance",
    SETTINGS_BILLING: "/settings/billing",
    SETTINGS_SECURITY: "/settings/security",
    SETTINGS_PAYMENT: "/settings/pembayaran",
  };
