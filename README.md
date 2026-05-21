# CPU Scheduling Simulator

Aplikasi interaktif untuk simulasi dan analisis algoritma penjadwalan CPU pada sistem operasi.

## Fitur Utama

- **4 Algoritma Penjadwalan**: FCFS, SJF, Round Robin, Priority Scheduling
- **Visualisasi Gantt Chart**: Animasi step-by-step dengan kontrol play/pause
- **Perbandingan Metrik**: Analisis side-by-side dari semua algoritma
- **Input Fleksibel**: Tambah/hapus proses secara dinamis atau generate random
- **Dashboard Interaktif**: Metrik lengkap dengan highlight algoritma terbaik
- **Detail Proses**: Klik proses untuk melihat detail lengkap eksekusi

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool dan dev server
- **Tailwind CSS**: Styling utility-first
- **Recharts**: Data visualization (optional untuk chart advanced)
- **Lucide React**: Icons

## Instalasi

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Penggunaan

1. **Konfigurasi Proses**:
   - Tambahkan proses dengan form "Tambah Proses Baru"
   - Atau gunakan tombol "Random" untuk generate data demo
   - Atur Quantum untuk Round Robin

2. **Lihat Hasil**:
   - Pilih algoritma dengan button di section Gantt Chart
   - Observasi perbedaan penjadwalan antar algoritma
   - Klik Play untuk animasi atau gunakan Next/Prev untuk step-by-step

3. **Analisis Metrik**:
   - Lihat ringkasan metrik di side panel
   - Algoritma terbaik di-highlight otomatis
   - Detail proses dapat dilihat dengan klik pada tabel

## Algoritma yang Diimplementasikan

### FCFS (First Come, First Served)
- Proses yang datang pertama akan dieksekusi terlebih dahulu
- Sederhana tapi sering menghasilkan waiting time yang panjang

### SJF (Shortest Job First)
- Proses dengan burst time terpendek diprioritaskan
- Lebih efisien dalam mengurangi average waiting time
- Versi non-preemptive

### Round Robin (RR)
- Setiap proses mendapat jatah waktu (quantum)
- Lebih fair dan cocok untuk sistem interaktif
- Quantum dapat dikonfigurasi

### Priority Scheduling
- Proses dengan prioritas tertinggi (nilai terendah) dieksekusi terlebih dahulu
- Memungkinkan kontrol terhadap proses mana yang penting
- Versi non-preemptive

## Metrik yang Diukur

- **Waiting Time**: Waktu menunggu proses untuk dieksekusi
- **Response Time**: Waktu dari request hingga respons pertama
- **Turnaround Time**: Total waktu dari arrival hingga selesai
- **Throughput**: Jumlah proses yang selesai per unit waktu

## Struktur Project

```
src/
├── App.jsx                    # Komponen utama
├── main.jsx                   # Entry point
├── index.css                  # Global styles
├── algorithms/
│   └── schedulingAlgorithms.js # Implementasi 4 algoritma
└── components/
    ├── ProcessInput.jsx       # Form input proses
    ├── GanttChart.jsx         # Visualisasi Gantt Chart
    ├── MetricsComparison.jsx  # Tabel perbandingan metrik
    └── ProcessResultsTable.jsx # Detail hasil penjadwalan
```

## Development

Untuk development dengan hot reload:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

## Build untuk Production

```bash
npm run build
```

Output akan berada di folder `dist/`

## Catatan Implementasi

- Algoritma menggunakan array untuk queue dan proses
- Timeline disimpan sebagai array of objects dengan startTime, endTime, processId, color
- Kalkulasi metrik dilakukan secara real-time setelah setiap algoritma selesai
- Animasi Gantt Chart menggunakan React state dan useEffect

## Kontribusi

Untuk pengembangan lebih lanjut:
1. Tambahkan algoritma baru (Preemptive SJF, HRRN, dll)
2. Implementasi step-by-step mode yang lebih detail
3. Export hasil simulasi ke file
4. Comparison timeline untuk semua algoritma sekaligus

## License

MIT
