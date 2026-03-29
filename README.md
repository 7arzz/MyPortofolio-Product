# 💎 Premium Portfolio & CMS Dashboard

Template portofolio profesional dan modern yang dibangun menggunakan **React**, **Vite**, dan **Firebase**. Proyek ini hadir dengan desain **Glassmorphism UI** yang estetis dan **Dashboard Admin** yang lengkap untuk mengelola seluruh konten tanpa harus menyentuh kode program.

---

## ✨ Fitur Utama

### 🎨 Desain & Pengalaman Pengguna (UX)

- **Estetika Premium**: Desain modern "Glassmorphism" dengan gradasi warna yang cerah, **Dynamic Background Blobs**, dan mikro-animasi.
- **Visual Excellence**: Menggunakan tipografi modern (**Outfit** & **Plus Jakarta Sans**) dan sistem warna yang harmonis untuk kesan mewah.
- **Performa Super Cepat**: Integrasi **Smart Caching** (localStorage) dan **Skeletal Loaders** untuk pengalaman yang terasa "instan".
- **Sepenuhnya Responsif**: Tampilan optimal di perangkat Mobile, Tablet, dan Desktop dengan Navbar yang adaptif.

### 🛡️ Kemampuan Admin & CMS (100% Dynamic)

- **Manajemen Proyek**: Tambah, edit, dan hapus proyek (_works_) dengan kategori yang fleksibel.
- **Manajemen Tech Stack (Baru)**: Perbarui keahlian/stack Anda (Nama, Level, Ikon) langsung dari dashboard tanpa edit kode.
- **Manajemen Testimoni (Baru)**: Kelola feedback klien, rating, dan identitas pemberi testimoni dengan mudah.
- **Branding Situs Lengkap**: Ubah Nama, Title, Bio, dan Kontak. Perubahan nama otomatis memperbarui logo di seluruh situs.
- **Konten Hero & Footer**: Konfigurasi headline beranda, tombol CTA, tagline, dan copyright teks.
- **Akses Aman**: Portal admin dilindungi oleh **Firebase Authentication**.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js 18 + Vite (Sistem modul cepat)
- **Styling**: Vanilla CSS (Premium Glassmorphism & Dynamic Animations)
- **Database**: Google Firebase (Firestore)
- **Autentikasi**: Firebase Authentication
- **Asset**: Ikon berbasis Unicode/Emoji dan SVG kustom.

---

## 🚀 Memulai (Instalasi)

### 1. Instalasi

Clone repositori ini dan instal semua dependensi:

```bash
cd / buka file myPortofolio
npm install
```

### 2. Konfigurasi Firebase

Agar fitur database berfungsi, Anda perlu menyambungkan proyek Firebase sendiri:

1. Buat proyek di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Firestore Database** dan **Authentication** (Email/Password).
3. Salin konfigurasi proyek Anda dan tempel di `src/firebase/config.js`:

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "API_KEY_ANDA",
  authDomain: "PROJECT_ANDA.firebaseapp.com",
  projectId: "ID_PROJECT_ANDA",
  storageBucket: "PROJECT_ANDA.firebasestorage.app",
  messagingSenderId: "ID_SENDER_ANDA",
  appId: "ID_APP_ANDA",
};
```

### 3. Menjalankan Secara Lokal

Jalankan server pengembangan:

```bash
npm run dev
```

---

## 🔐 Panduan Admin

Semua pengaturan sekarang dikelola melalui portal admin. Anda tidak perlu lagi mengubah file `.jsx` secara manual untuk memperbarui konten.

### Cara Mengakses Portal Admin

1. Buka URL situs Anda dan tambahkan `/admin` di belakangnya (misal: `localhost:5173/admin`).
2. Login menggunakan kredensial Firebase yang telah Anda buat.
3. Gunakan menu **Dashboard** untuk proyek, dan **Settings** untuk seluruh konten lainnya.

### Kelola Konten Dinamis

- **Ubah Stack**: Masuk ke **Settings > Tech Stack**. Tambahkan ikon emoji (misal: ⚛️) atau nama tech yang baru.
- **Ubah Testimoni**: Masuk ke **Settings > Testimonials**. Kelola feedback dari klien Anda dengan rating bintang.
- **Branding**: Masuk ke **Settings > Profile**. Ganti Nama Anda untuk memperbarui identitas di Navbar dan Footer secara global.

---

## 📦 Pengiriman (Deployment)

### Membuat Build Produksi:

```bash
npm run build
```

Unggah isi folder `dist` yang dihasilkan ke penyedia hosting statis pilihan Anda (Vercel, Netlify, atau Firebase Hosting).

---

## 📝 Lisensi

Proyek ini bersifat open-source dan tersedia di bawah **Lisensi MIT**.

Dibuat dengan ❤️ untuk para kreator dan developer.
