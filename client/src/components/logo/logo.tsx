import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import logo from "../../../public/logo.svg";
import { cn } from "@/lib/utils";

/**
 * Props untuk komponen Logo.
 * - `url`: tujuan link saat logo diklik (default mengarah ke halaman overview).
 * - `color`: warna teks logo (default: putih).
 * - `showText`: menentukan apakah teks "CekSaku" ditampilkan atau disembunyikan.
 * - `className`: untuk menambahkan class tambahan dari luar.
 */
interface LogoProps {
  url?: string;
  color?: string;
  showText?: boolean;
  className?: string;
}

/**
 * Komponen Logo aplikasi.
 * Menampilkan ikon logo dan teks "CekSaku" dengan animasi buka/tutup.
 * Teks dapat disembunyikan secara halus saat sidebar ditutup.
 */
const Logo = (props: LogoProps) => {
  // Tentukan warna teks berdasarkan props, default ke "white".
  const logoTextColor = props.color || "white";

  // Jika showText tidak diberikan, default-nya adalah true (teks tampil).
  const showText = props.showText !== undefined ? props.showText : true;

  return (
    <Link
      // Navigasi ke halaman yang ditentukan, default ke PROTECTED_ROUTES.OVERVIEW
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className={cn(
        "flex items-center font-semibold",
        // Jika teks tampil, beri jarak antar ikon dan teks
        showText ? "gap-2" : "gap-0",
        // Tambahkan class tambahan dari props jika ada
        props.className
      )}
    >
      {/* ============================================
          =============== LOGO ICON =================
          ============================================
          Menampilkan ikon utama logo aplikasi dari file SVG publik.
      */}
      <img src={logo} alt="CekSaku Logo" className="h-8 w-8" />

      {/* ============================================
          ================ LOGO TEXT ================
          ============================================
          Menampilkan teks "CekSaku" dengan animasi transisi.
          Teks akan memudar dan mengecil saat sidebar ditutup.
      */}
      <span
        className={cn(
          "whitespace-nowrap text-lg transition-all duration-200 ease-in-out",
          `text-${logoTextColor}`,
          showText ? "w-auto opacity-100" : "w-0 opacity-0"
        )}
      >
        CekSaku
      </span>
    </Link>
  );
};

export default Logo;
