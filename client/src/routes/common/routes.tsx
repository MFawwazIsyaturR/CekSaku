import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import GithubCallback from "@/pages/auth/GithubCallback";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import Security from "@/pages/settings/security";
import GoogleCallback from "@/pages/auth/GoogleCallback";
import TermsAndConditions from "@/pages/landing/TermsAndConditions";
import ContactPage from "@/pages/landing/ContactPage";
import BillingPage from "@/pages/billing";
import Payment from "@/pages/settings/payment";
import AssetsPage from "@/pages/assets";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.LANDING, element: <LandingPage /> },
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: "/auth/google/callback", element: <GoogleCallback /> },
  { path: "/auth/github/callback", element: <GithubCallback /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: "/syarat-ketentuan", element: <TermsAndConditions /> },
  { path: "/kontak", element: <ContactPage /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.BILLING, element: <BillingPage /> },
   { path: PROTECTED_ROUTES.ASSETS, element: <AssetsPage /> },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <Settings />,
    children: [
      { index: true, element: <Account /> }, // Default route
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
      { path: PROTECTED_ROUTES.SETTINGS_SECURITY, element: <Security /> },
      { path: PROTECTED_ROUTES.SETTINGS_PAYMENT, element: <Payment /> },
    ],
  },
];
