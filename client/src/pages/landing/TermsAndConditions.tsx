// client/src/pages/legal/TermsAndConditions.tsx

import Logo from "@/components/logo/logo";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="bg-black text-gray-300 min-h-screen font-sans">
      <header className="py-4 px-6 md:px-12 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <Logo url={AUTH_ROUTES.LANDING} color="white" />
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 md:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Syarat dan Ketentuan
          </h1>
          <p className="text-gray-400 mb-8">
            Terakhir diperbarui: 27 Oktober 2025 {/* Ganti dengan tanggal update Anda */}
          </p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Ketentuan Penggunaan
              </h2>
              <p>
                Layanan CekSaku ditawarkan kepada Anda, pengguna, dengan syarat
                penerimaan Anda terhadap syarat, ketentuan, dan pemberitahuan
                yang terkandung atau dirujuk di sini serta syarat dan
                ketentuan, perjanjian, dan pemberitahuan tambahan yang mungkin
                berlaku pada setiap halaman atau bagian dari Situs ini.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Tinjauan Umum
              </h2>
              <p>
                Penggunaan Anda atas Situs ini merupakan persetujuan Anda
                terhadap semua syarat, ketentuan, dan pemberitahuan. Harap baca
                dengan seksama. Dengan menggunakan Situs ini, Anda menyetujui Syarat
                dan Ketentuan ini, serta syarat, pedoman, atau aturan lain yang
                berlaku untuk setiap bagian dari Situs ini, tanpa batasan atau
                kualifikasi. Jika Anda tidak menyetujui Syarat dan Ketentuan
                ini, Anda harus segera keluar dari Situs dan menghentikan
                penggunaan informasi atau produk apa pun dari Situs ini.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Modifikasi Situs dan Syarat & Ketentuan Ini
              </h2>
              <p>
                CekSaku berhak untuk mengubah, memodifikasi, memperbarui, atau
                menghentikan syarat, ketentuan, dan pemberitahuan di mana Situs
                ini ditawarkan serta tautan, konten, informasi, harga, dan
                materi lain yang ditawarkan melalui Situs ini kapan saja tanpa
                pemberitahuan atau kewajiban lebih lanjut kepada Anda. Kami
                berhak menyesuaikan harga dari waktu ke waktu. Jika karena
                suatu alasan terjadi kesalahan harga, CekSaku berhak menolak
                pesanan atau langganan. Dengan terus menggunakan Situs setelah
                modifikasi, perubahan, atau pembaruan tersebut, Anda setuju
                untuk terikat oleh modifikasi, perubahan, atau pembaruan
                tersebut.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Pemberian Lisensi
              </h2>
              <p>
                CekSaku memberi Anda hak untuk mengakses dan menggunakan
                Platform Perangkat Lunak Berlisensi semata-mata untuk tujuan
                pengelolaan keuangan pribadi Anda selama Perjanjian ini berlaku. Hak ini non-eksklusif, tidak dapat dialihkan, dan dibatasi
                oleh serta tunduk pada Perjanjian ini. Anda tidak boleh: (a)
                memodifikasi, mengadaptasi, mendekompilasi, membongkar, atau
                merekayasa balik komponen apa pun dari Platform Perangkat Lunak
                Berlisensi; (b) membuat karya turunan berdasarkan komponen apa
                pun dari Platform Perangkat Lunak Berlisensi; (c) mengizinkan
                pihak ketiga mana pun untuk menggunakan atau memiliki akses ke
                komponen apa pun dari Platform Perangkat Lunak Berlisensi atau
                Dokumentasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Hak Kepemilikan
              </h2>
              <p>
                Anda mengakui dan setuju bahwa: (a) Platform Perangkat Lunak
                Berlisensi dan Dokumentasi adalah milik CekSaku atau pemberi
                lisensinya dan bukan milik Anda, dan (b) Anda akan menggunakan
                Platform Perangkat Lunak Berlisensi dan Dokumentasi hanya di
                bawah syarat dan ketentuan yang dijelaskan di sini.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Biaya
              </h2>
              <p>
                CekSaku menyediakan paket "Gratis" dengan fitur terbatas dan
                paket "Pro" berbayar. Sebagai imbalan atas lisensi yang
                diberikan untuk paket "Pro", Anda akan membayar biaya lisensi
                ("Biaya Lisensi") sebagaimana diatur dalam jadwal biaya di
                halaman Harga Situs. Biaya Lisensi tidak termasuk PPN dan akan
                ditagih secara bulanan atau tahunan ke detail kartu kredit atau
                metode pembayaran lain yang Anda sediakan melalui gateway
                pembayaran Midtrans. Semua faktur akan dikirim ke alamat email Anda yang ditentukan sebagai bagian
                dari proses registrasi.
              </p>
              {/* Tambahkan klausul spesifik Midtrans jika diperlukan */}
              <p className="mt-2">
                Pembayaran diproses melalui Midtrans. Dengan menggunakan layanan berbayar kami,
                Anda juga setuju untuk terikat oleh Syarat dan Ketentuan Midtrans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Kebijakan Privasi
              </h2>
              <p>
                Informasi Anda aman bersama kami. CekSaku memahami bahwa masalah
                privasi sangat penting bagi pelanggan kami. Anda dapat yakin
                bahwa informasi apa pun yang Anda kirimkan kepada kami tidak
                akan disalahgunakan, disalahgunakan, atau dijual kepada pihak
                lain mana pun. Kami hanya menggunakan informasi pribadi Anda
                untuk menyediakan layanan kami dan memproses pembayaran Anda.
                Untuk detail lebih lanjut, silakan lihat Kebijakan Privasi kami
                [Tambahkan Tautan ke Kebijakan Privasi jika ada].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Keamanan
              </h2>
              <p>
                CekSaku akan mengambil semua langkah yang wajar untuk mencegah
                pelanggaran keamanan dalam interaksi servernya dengan Anda dan
                pelanggaran keamanan dalam interaksi dengan sumber daya atau
                pengguna di luar firewall apa pun yang mungkin dibangun di
                server CekSaku. Kami menggunakan enkripsi standar industri
                untuk melindungi data Anda.
              </p>
            </section>

             <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Penghentian Layanan
              </h2>
              <p>
                CekSaku, atas kebijakannya sendiri, dapat menangguhkan atau menghentikan Perjanjian ini dengan segera jika: CekSaku mencurigai Anda membahayakan Platform Perangkat Lunak Berlisensi; atau Anda melakukan pelanggaran material apa pun terhadap kewajiban Anda berdasarkan Perjanjian ini; atau Anda berhenti menjalankan bisnis atau menjadi tidak mampu membayar hutang Anda; atau Anda telah atau mungkin menjadi tidak mampu melaksanakan kewajiban Anda berdasarkan Perjanjian ini. Jika Perjanjian ini dihentikan, Anda setuju untuk mengembalikan atau menyatakan penghancuran semua salinan Platform Perangkat Lunak Berlisensi dan Dokumentasi, dan semua jumlah yang terutang oleh Anda berdasarkan Perjanjian ini akan segera jatuh tempo dan harus dibayar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Batasan Tanggung Jawab (Disclaimer)
              </h2>
              <p>
               CekSaku tidak bertanggung jawab atas keakuratan, kebenaran, ketepatan waktu, atau konten Materi yang disediakan di Situs ini. Anda tidak boleh berasumsi bahwa Materi di Situs ini terus diperbarui atau berisi informasi terkini. CekSaku tidak bertanggung jawab untuk menyediakan konten atau materi dari Situs yang telah kedaluwarsa atau telah dihapus. Layanan disediakan "sebagaimana adanya" tanpa jaminan apa pun.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Hukum yang Berlaku
              </h2>
              <p>
                Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di
                Indonesia. Setiap perselisihan akan diselesaikan di pengadilan
                Indonesia yang berwenang.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                12. Pertanyaan dan Umpan Balik
              </h2>
              <p>
                Kami menyambut pertanyaan, komentar, dan kekhawatiran Anda
                tentang privasi atau informasi apa pun yang dikumpulkan dari
                Anda atau tentang Anda. Silakan kirimkan kepada kami setiap dan
                semua umpan balik yang berkaitan dengan privasi, atau masalah
                lainnya melalui nomor telepon dukungan pelanggan kami di
                +62 821-3177-1217
              </p>
            </section>

            <div className="border-t border-gray-700 pt-8 mt-12 text-sm text-gray-400">
              <p className="font-semibold">Pemberitahuan Hukum</p>
              <p>
                CekSaku adalah merek dagang dari Muhammad Fawwaz Isyatur Rahman
              </p>
              <p>Hak Cipta © {new Date().getFullYear()} Semua Hak Dilindungi.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;