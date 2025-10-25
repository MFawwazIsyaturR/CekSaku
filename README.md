# CekSaku: Manajer Keuangan Pribadi Cerdas Anda 💰

[![Lisensi: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Versi Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-blue.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey.svg)](https://expressjs.com/)

CekSaku adalah Website pengelolaan keuangan pribadi yang memudahkan pencatatan dan pengaturan finansial, dengan tujuan membantu pengguna mencapai kebebasan finansial. Tangguh dalam mengelola dan menganalisis data keuangan pribadi, terintegrasi dengan AI untuk wawasan yang lebih cerdas.

---

## ✨ Fitur & Manfaat Utama

* 🔐 **Autentikasi Aman:** Registrasi dan login pengguna dilindungi dengan hashing bcrypt. Integrasi OAuth dengan Google & GitHub.
* 📊 **Manajemen Data:** Endpoint API komprehensif untuk melacak pemasukan dan pengeluaran dengan mudah.
* 🧾 **Pemindai Struk AI:** Ekstrak detail transaksi secara otomatis dari gambar struk menggunakan Google AI.
* 📈 **Pelaporan Keuangan:** Hasilkan laporan mendalam yang merinci total pendapatan, pengeluaran, tingkat tabungan, dan kategori pengeluaran.
* 💡 **Analitik Berbasis AI:** Dapatkan pemahaman lebih dalam tentang kebiasaan belanja dan kesehatan finansial dengan wawasan yang dihasilkan oleh Google AI.
* ☁️ **Integrasi Cloudinary:** Unggah dan kelola gambar struk dengan mulus.
* 📧 **Laporan Email Otomatis:** Terima ringkasan keuangan berkala langsung di kotak masuk Anda (didukung oleh Resend).
* 🔄 **Transaksi Berulang:** Atur dan kelola pendapatan dan pengeluaran berulang secara otomatis.
* 💾 **Impor/Ekspor Data:** Impor transaksi massal dengan mudah melalui CSV dan ekspor data Anda.

---

## 🚀 Tumpukan Teknologi (Tech Stack)

* **Backend:** Node.js, Express.js, TypeScript  
* **Database:** MongoDB dengan Mongoose  
* **Autentikasi:** JWT (JSON Web Tokens), Passport.js, bcrypt  
* **AI:** Google AI (Model Gemini)  
* **Penyimpanan File:** Cloudinary  
* **Email:** Resend  
* **Penjadwalan:** node-cron  

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

* **Node.js:** Versi 18 atau lebih tinggi ([Unduh Node.js](https://nodejs.org/))
* **npm** (Node Package Manager - disertakan dengan Node.js)
* **MongoDB:** Instance yang berjalan (lokal atau berbasis cloud seperti MongoDB Atlas) ([Panduan Instalasi MongoDB](https://docs.mongodb.com/manual/installation/))

---

## 🛠️ Instalasi & Pengaturan

Ikuti langkah-langkah ini untuk menjalankan backend CekSaku secara lokal:

1. **Klon Repositori:**
   ```bash
   git clone <url-repositori-anda>
   cd CekSaku/backend
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan:**
   Buat file `.env` di direktori `backend/`. Salin konten dari `.env.example` (jika tersedia) atau tambahkan variabel berikut, ganti placeholder dengan kredensial Anda yang sebenarnya:
   ```dotenv
   # MongoDB
   MONGO_URI=<String Koneksi MongoDB Anda> # cth., mongodb://localhost:27017/ceksaku

   # Konfigurasi Server
   PORT=5000 # Atau port lain yang Anda inginkan
   BASE_PATH=/api # Path dasar API
   NODE_ENV=development # development atau production

   # Autentikasi JWT
   JWT_SECRET=<Kunci Rahasia JWT Kuat Anda>
   JWT_EXPIRES_IN=15m # Kedaluwarsa token akses (cth., 15m, 1h, 1d)
   JWT_REFRESH_SECRET=<Kunci Rahasia Refresh JWT Kuat Anda>
   JWT_REFRESH_EXPIRES_IN=7d # Kedaluwarsa token refresh

   # Google OAuth (Opsional)
   GOOGLE_CLIENT_ID=<Client ID Google Anda>
   GOOGLE_CLIENT_SECRET=<Client Secret Google Anda>
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

   # GitHub OAuth (Opsional)
   GITHUB_CLIENT_ID=<Client ID GitHub Anda>
   GITHUB_CLIENT_SECRET=<Client Secret GitHub Anda>
   GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback

   # Google AI (Gemini)
   GEMINI_API_KEY=<Kunci API Google AI Anda>

   # Cloudinary (untuk Unggah Gambar)
   CLOUDINARY_CLOUD_NAME=<Nama Cloud Cloudinary Anda>
   CLOUDINARY_API_KEY=<Kunci API Cloudinary Anda>
   CLOUDINARY_API_SECRET=<Rahasia API Cloudinary Anda>

   # Resend (untuk Email)
   RESEND_API_KEY=<Kunci API Resend Anda>
   RESEND_MAILER_SENDER=noreply@domainanda.com

   # Konfigurasi Frontend
   FRONTEND_ORIGIN=http://localhost:5173
   ```
   **Catatan Keamanan:** Jangan pernah meng-commit file `.env` Anda ke kontrol versi! Tambahkan ke file `.gitignore` Anda.

4. **Pengaturan Database:**
   Pastikan instance MongoDB Anda berjalan dan dapat diakses. `MONGO_URI` di file `.env` Anda harus menunjuk ke database Anda.

5. **Mulai Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Perintah ini menggunakan `ts-node-dev` untuk restart otomatis saat ada perubahan file selama pengembangan. Server biasanya akan tersedia di `http://localhost:5000` (atau `PORT` yang Anda tentukan).

6. **(Opsional) Build untuk Produksi:**
   ```bash
   npm run build
   ```

7. **(Opsional) Mulai Server Produksi:**
   ```bash
   npm start
   ```

---

## 📚 Dokumentasi API & Penggunaan

Untuk informasi terperinci tentang endpoint API yang tersedia, format permintaan/respons, dan contoh penggunaan, silakan merujuk ke file controller yang terletak di direktori `backend/src/controllers/`.

**Contoh: Mengambil Data Analitik**  
*(Lihat `analytics.controller.ts` untuk implementasi lengkap)*

```typescript
// Cuplikan analytics.controller.ts
import { Request, Response } from "express";
import { summaryAnalyticsService } from "../services/analytics.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const summaryAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    // ... (logika untuk mendapatkan rentang tanggal dari req.query)

    const stats = await summaryAnalyticsService(userId, /* parameter rentang tanggal */);

    return res.status(200).json({
      message: "Ringkasan berhasil diambil",
      data: stats,
    });
  }
);
```

---

## 🔧 Variabel Lingkungan

| Variabel | Deskripsi | Default | Wajib |
| :-- | :-- | :-- | :-- |
| `MONGO_URI` | String koneksi MongoDB. |  | Ya |
| `PORT` | Nomor port server. | `5000` | Tidak |
| `NODE_ENV` | Lingkungan aplikasi (`development`/`production`). | `development` | Tidak |
| `BASE_PATH` | Path dasar API. | `/api` | Tidak |
| `JWT_SECRET` | Kunci rahasia token akses JWT. |  | Ya |
| `JWT_EXPIRES_IN` | Waktu kedaluwarsa token akses. | `15m` | Tidak |
| `JWT_REFRESH_SECRET` | Kunci rahasia token refresh. |  | Ya |
| `JWT_REFRESH_EXPIRES_IN` | Kedaluwarsa token refresh. | `7d` | Tidak |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth. |  | Tidak |
| `GOOGLE_CLIENT_SECRET` | Client Secret Google OAuth. |  | Tidak |
| `GOOGLE_REDIRECT_URI` | URI Pengalihan Google OAuth. |  | Tidak |
| `GITHUB_CLIENT_ID` | Client ID GitHub OAuth. |  | Tidak |
| `GITHUB_CLIENT_SECRET` | Client Secret GitHub OAuth. |  | Tidak |
| `GITHUB_REDIRECT_URI` | URI Pengalihan GitHub OAuth. |  | Tidak |
| `GEMINI_API_KEY` | Kunci API Google AI (Gemini). |  | Ya |
| `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary. |  | Ya |
| `CLOUDINARY_API_KEY` | Kunci API Cloudinary. |  | Ya |
| `CLOUDINARY_API_SECRET` | Rahasia API Cloudinary. |  | Ya |
| `RESEND_API_KEY` | Kunci API Resend untuk email. |  | Ya |
| `RESEND_MAILER_SENDER` | Email pengirim default Resend. |  | Ya |
| `FRONTEND_ORIGIN` | URL frontend untuk CORS. |  | Ya |

---

## 🤝 Pedoman Kontribusi

Kami menyambut kontribusi untuk membuat **CekSaku** menjadi lebih baik!  
Ikuti langkah berikut untuk berkontribusi:

1. **Fork** repositori ini.  
2. **Klon** repositori fork Anda:  
   ```bash
   git clone https://github.com/nama-pengguna-anda/CekSaku.git
   ```
3. **Buat branch baru** untuk fitur atau perbaikan Anda:  
   ```bash
   git checkout -b fitur/nama-fitur-anda
   ```
4. **Lakukan perubahan**, tambahkan tes jika perlu.  
5. **Commit** dengan pesan jelas:  
   ```bash
   git commit -m "fitur: Tambah fitur baru yang luar biasa"
   ```
6. **Push** ke GitHub dan **kirim Pull Request**.  

Terima kasih atas kontribusinya! 💪

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT** – lihat file [LICENSE](https://opensource.org/licenses/MIT) untuk detailnya.

---

## 🙏 Ucapan Terima Kasih

* Dibangun dengan alat dan pustaka open-source yang luar biasa.  
* Terima kasih khusus kepada pengembang **Express.js**, **TypeScript**, **MongoDB**, **Passport.js**, **Google AI**, **Cloudinary**, **Resend**, dan semua dependensi lainnya.

---
