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
import VerifyEmail from "@/pages/auth/_component/verify-email";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.LANDING, element: <LandingPage /> },
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: "/auth/google/callback", element: <GoogleCallback /> },
  { path: "/auth/github/callback", element: <GithubCallback /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: "/syarat-ketentuan", element: <TermsAndConditions /> },
  { path: "/kontak", element: <ContactPage /> },
];



import PaymentManagement from "@/pages/admin/PaymentManagement";

export const adminRoutePaths = [
  { path: PROTECTED_ROUTES.ADMIN_DASHBOARD, element: <AdminDashboard /> },

  { path: PROTECTED_ROUTES.ADMIN_PAYMENTS, element: <PaymentManagement /> },
  {
    path: PROTECTED_ROUTES.ADMIN_SETTINGS,
    element: <Settings />,
    children: [
      { index: true, element: <Account /> },
      { path: "appearance", element: <Appearance /> },
      { path: "security", element: <Security /> },
    ],
  },
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
      { index: true, element: <Account /> },
      { path: "appearance", element: <Appearance /> },
      { path: "security", element: <Security /> },
      { path: "pembayaran", element: <Payment /> },
    ],
  },
];
