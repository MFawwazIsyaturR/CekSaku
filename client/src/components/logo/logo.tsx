import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import logo from "../../../public/logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  url?: string;
  color?: string;
  showText?: boolean;
  className?: string;
}

const Logo = (props: LogoProps) => {
  const logoTextColor = props.color || "white";
  const showText = props.showText !== undefined ? props.showText : true;

  return (
    <Link
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className={cn(
        "flex items-center gap-2 font-semibold",
        props.className
      )}
    >
    
      <img src={logo} alt="CekSaku Logo" className="h-8 w-8 shrink-0" />


      <span
        className={cn(
          "whitespace-nowrap text-lg transition-all duration-300 ease-in-out overflow-hidden",
          `text-${logoTextColor}`,
          showText 
            ? "max-w-[200px] opacity-100" 
            : "max-w-0 opacity-0"         
        )}
      >
        CekSaku
      </span>
    </Link>
  );
};

export default Logo;