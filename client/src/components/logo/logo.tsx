import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import logo from "../../../public/logo.svg"; // Pastikan path logo benar

const Logo = (props: { url?: string;  color?: string;}) => {
   const logoTextColor = props.color || "white";

  return (
    <Link
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className="flex items-center gap-2"
    >
      <img
        src={logo}
        alt="CekSaku Logo"
        className="h-8 w-8"
      />
       <span className={`font-semibold text-lg text-${logoTextColor}`}>CekSaku</span>
    </Link>
  );
};

export default Logo;
