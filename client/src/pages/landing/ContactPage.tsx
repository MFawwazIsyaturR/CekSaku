import Logo from "@/components/logo/logo";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

const ContactPage = () => {
  const phoneNumber = "+62 821 3177 1217";
  const emailAddress = "support@ceksaku.com";

  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans">
      <header className="py-4 px-6 md:px-12 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <Logo url={AUTH_ROUTES.LANDING} color="white" />
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 md:px-12 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 hero-title-gradient">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            Kami siap membantu! Jangan ragu untuk menghubungi kami melalui
            informasi di bawah ini.
          </p>

          <div className="space-y-8 text-left md:text-center">
            {/* Nomor Telepon */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <Phone className="w-6 h-6 text-blue-400" />
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`} // Format untuk tautan telepon
                className="text-lg text-white hover:text-blue-300 transition-colors"
              >
                {phoneNumber}
              </a>
            </div>

            {/* Alamat Email */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <Mail className="w-6 h-6 text-blue-400" />
              <a
                href={`mailto:${emailAddress}`}
                className="text-lg text-white hover:text-blue-300 transition-colors break-all" // break-all untuk email panjang
              >
                {emailAddress}
              </a>
            </div>
          </div>

          <p className="mt-16 text-gray-500">
            Jam Operasional: Senin - Jumat, 09:00 - 17:00 WIB
          </p>
        </div>
      </main>
        {/* Footer sederhana di halaman kontak */}
        <footer className="py-6 border-t border-gray-700 mt-16">
            <div className="container mx-auto text-center text-sm text-gray-500">
                 &copy; {new Date().getFullYear()} CekSaku. All rights reserved. | <Link to="/syarat-ketentuan" className="hover:text-gray-300 underline">Syarat & Ketentuan</Link>
            </div>
        </footer>
    </div>
  );
};

export default ContactPage;