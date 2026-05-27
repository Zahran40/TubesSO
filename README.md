# 🖥️ RuangCPU — CPU Scheduling Simulator

Aplikasi simulasi penjadwalan CPU berbasis web yang interaktif dan visual. Dilengkapi dengan animasi Gantt Chart real-time, perbandingan metrik antar algoritma, mode Geometry Dash, serta fitur AI Storyteller & AI Ask Agent yang ditenagai oleh Groq API.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🧮 **4 Algoritma Penjadwalan** | FCFS, SJF (Non-Preemptive), Round Robin, Priority Scheduling |
| 🎬 **Gantt Chart Interaktif** | Animasi play/pause/step dengan dua mode tampilan |
| 🎮 **Mode Geometry Dash** | Visualisasi unik berbasis permainan |
| 📊 **Perbandingan Metrik** | Analisis Waiting Time, Turnaround, Response Time & Throughput |
| 🤖 **AI Storyteller** | Narasi otomatis alur proses saat simulasi berjalan |
| 💬 **AI Ask Agent** | Chatbot AI untuk tanya-jawab tentang hasil penjadwalan |
| 📜 **Riwayat Simulasi** | Simpan dan muat ulang sesi simulasi sebelumnya |

---

## 🛠️ Tech Stack

- **React 18** — UI Framework
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Grafik perbandingan metrik
- **Lucide React** — Icon library
- **Sonner** — Toast notifications
- **OpenAI SDK** — Koneksi ke Groq API (AI features)

---

## 🚀 Panduan Setup & Instalasi

### Prasyarat

Pastikan perangkat Anda sudah terinstal:
- **Node.js** versi 18 atau lebih baru → [Download di sini](https://nodejs.org/)
- **npm** (sudah termasuk bersama Node.js)
- **Git** → [Download di sini](https://git-scm.com/)

Cek versi yang terinstal:
```bash
node -v   # Harus >= 18.0.0
npm -v    # Harus >= 8.0.0
```

---

### Langkah 1: Clone Repository

```bash
git clone https://github.com/Zahran40/TubesSO.git
cd TubesSO
```

---

### Langkah 2: Install Dependencies

```bash
npm install
```

Perintah ini akan menginstal semua package yang dibutuhkan termasuk `openai` untuk fitur AI.

---

### Langkah 3: Konfigurasi AI (Groq API) ⚡

Fitur **AI Storyteller** dan **AI Ask Agent** membutuhkan API Key dari Groq. Ikuti langkah berikut:

1. Buka browser dan pergi ke **[https://console.groq.com/](https://console.groq.com/)**
2. Login menggunakan akun Google Anda
3. Di menu kiri, klik **"API Keys"** → **"Create API Key"**
4. Beri nama kunci Anda (contoh: `RuangCPU`), lalu klik **Submit**
5. **Salin (Copy)** kunci yang muncul (dimulai dengan `gsk_...`)

Kemudian buka file `src/services/ai.js` dan ganti nilai `apiKey`:

```js
const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: 'gsk_GANTI_DENGAN_API_KEY_ANDA', // ← Tempel API Key di sini
  dangerouslyAllowBrowser: true
});
```

> **Catatan:** Groq menyediakan API gratis dengan batas penggunaan harian yang cukup besar untuk keperluan pengembangan dan demonstrasi.

---

### Langkah 4: Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di: **`http://localhost:5173`**

Buka URL tersebut di browser Anda dan aplikasi siap digunakan!

---

## 📁 Struktur Project

```
TubesSO/
├── public/                        # Aset statis
├── src/
│   ├── App.jsx                    # Komponen utama & routing antar halaman
│   ├── main.jsx                   # Entry point React
│   ├── index.css                  # Global styles
│   │
│   ├── algorithms/
│   │   └── schedulingAlgorithms.js  # Implementasi 4 algoritma penjadwalan
│   │
│   ├── services/
│   │   └── ai.js                  # Konfigurasi Groq API & fungsi AI
│   │
│   └── components/
│       ├── GanttChart.jsx         # Visualisasi Gantt Chart + AI Storyteller
│       ├── ProcessInput.jsx       # Form input & manajemen proses
│       ├── MetricsComparison.jsx  # Grafik perbandingan metrik 4 algoritma
│       ├── ProcessResultsTable.jsx # Tabel hasil + AI Ask Agent
│       └── layout/
│           └── Sidebar.jsx        # Navigasi sidebar
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧠 Algoritma yang Diimplementasikan

### 1. FCFS — First Come, First Served
Mengeksekusi proses berdasarkan urutan kedatangan (*Arrival Time*). Algoritma paling sederhana namun rentan terhadap *Convoy Effect*.

### 2. SJF — Shortest Job First (Non-Preemptive)
Memilih proses dengan *Burst Time* terpendek dari semua proses yang sudah tersedia. Optimal dalam meminimalkan *Average Waiting Time*, namun bersifat non-preemptive (proses yang sedang berjalan tidak bisa disela).

### 3. Round Robin (RR)
Setiap proses mendapat jatah waktu eksekusi (*Time Quantum*) yang dapat dikonfigurasi. Adil dan cocok untuk sistem interaktif. Mendukung *preemption* otomatis ketika quantum habis.

### 4. Priority Scheduling (Non-Preemptive)
Proses dengan nilai prioritas terendah (= prioritas tertinggi) dieksekusi terlebih dahulu. Dilengkapi *tie-breaking* berdasarkan *Arrival Time* untuk memastikan hasil yang deterministik.

---

## 📐 Rumus Metrik

| Metrik | Rumus |
|---|---|
| **Waiting Time** | `Start Time − Arrival Time` |
| **Response Time** | `First Start Time − Arrival Time` |
| **Turnaround Time** | `End Time − Arrival Time` |
| **Throughput** | `Jumlah Proses ÷ Total Waktu Selesai` |
| **Avg Waiting Time** | `Σ Waiting Time ÷ Jumlah Proses` |

---

## ❓ Troubleshooting

**Q: Aplikasi gagal start dengan error `npm: command not found`**
→ Pastikan Node.js sudah terinstal dengan benar dan PATH sudah dikonfigurasi. Coba restart terminal setelah instalasi.

**Q: AI Storyteller menampilkan pesan error**
→ Pastikan API Key Groq sudah diisi dengan benar di `src/services/ai.js` dan koneksi internet aktif.

**Q: Halaman kosong setelah `npm run dev`**
→ Coba hapus folder `node_modules` dan jalankan ulang `npm install`.
```bash
rm -rf node_modules
npm install
npm run dev
```

**Q: Port 5173 sudah dipakai**
→ Vite akan otomatis mencari port berikutnya (5174, 5175, dst). Periksa output terminal untuk URL yang tepat.

---

## 📦 Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/`. Untuk preview hasil build:

```bash
npm run preview
```

---

## 👥 Tim Pengembang

Proyek ini dikembangkan sebagai Tugas Besar mata kuliah **Sistem Operasi**.

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan edukasi.
