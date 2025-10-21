import { Separator } from "@/components/ui/separator";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tagihan</h3>
        <p className="text-sm text-muted-foreground">
          Kelola langganan dan informasi penagihan Anda
        </p>
      </div>
      <Separator />

      <div className="w-full">
        {/* Current Plan */}
        {/* Upgrade Options */}
        <div className="mt-0">
          <h1 className="text-lg font-medium mb-2">Dukung Kami</h1>
          <p className="text-base mb-2">
            Fitur Penagihan adalah bagian dari <strong>versi lanjutan</strong>{" "}
            proyek ini. Butuh <strong>minggu dan bulan</strong> untuk merancang,
            membangun, dan menyempurnakannya..
          </p>

          <p className="text-base mb-2">
            Dengan mendukung kami, Anda akan membuka fitur penagihan premium,
            termasuk:
          </p>

          <ul className="list-disc pl-5 text-base mb-2">
            <li>
              <strong>Uji Coba Gratis + Langganan Stripe</strong>
            </li>
            <li>
              <strong>Paket Bulanan & Tahunan</strong> bawaan
            </li>
            <li>
              <strong>Beralih antar paket</strong> (bulanan ↔ tahunan)
            </li>
            <li>
              <strong>Kelola & Batalkan Langganan</strong> kapan saja
            </li>
            <li>
              <strong>Video Panduan Langkah demi Langkah</strong>
            </li>
            <li>
              <strong>Kode Sumber Lengkap</strong>
            </li>
            <li>
              <strong>Deployment Siap Produksi</strong>
            </li>
          </ul>

          <p className="text-base mb-2">
            Dukungan Anda membantu kami terus membangun proyek berkualitas
            tinggi secara gratis untuk komunitas.
          </p>

          <p className="text-base font-medium">
            🔓 <span className="text-green-600">Dapatkan disini:</span>
            <a
              className="text-blue-500 underline ml-1"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Klik Disini
            </a>
          </p>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Billing;
