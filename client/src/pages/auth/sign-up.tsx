import { AUTH_ROUTES } from "@/routes/common/routePath";
import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";

const SignUp = () => {
  return (
    <div className="relative bg-[#050505] min-h-screen flex flex-col items-center justify-center overflow-hidden">
  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900" />

  {/* Logo + Form Container */}
  <div className="z-10 w-full max-w-md px-4 mt-24 md:mt-24">
    {/* Centered Logo */}
    <div className="mb-8 flex justify-center">
      <Logo url={AUTH_ROUTES.LANDING} color="white" />
    </div>

    {/* Sign In Form */}
    <SignUpForm />
  </div>
</div>

  );
};

export default SignUp;
