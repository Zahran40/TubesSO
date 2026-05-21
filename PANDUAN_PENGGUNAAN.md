# CPU Scheduling Simulator - Panduan Penggunaan

## 🚀 Quick Start

Setelah npm install selesai:

```bash
npm run dev
```

Aplikasi akan otomatis membuka di `http://localhost:5173`

## 📋 Penjelasan Setiap Algoritma

### 1. FCFS (First Come, First Served)

**Cara Kerja:**
- Proses dieksekusi sesuai urutan kedatangannya
- Proses pertama yang datang akan dijalankan sampai selesai
- Sangat sederhana dan fair

**Keuntungan:**
- Implementasi sederhana
- Tidak ada starvation

**Kerugian:**
- Convoy effect (proses besar menghalangi yang kecil)
- Waiting time bisa sangat panjang

**Contoh Timeline:**
```
P1(8) -> P2(4) -> P3(2) -> P4(4) -> P5(5)
[0   8] [8  12] [12 14] [14 18] [18 23]
```

---

### 2. SJF (Shortest Job First)

**Cara Kerja:**
- Di antara proses yang sudah tiba, pilih yang burst timenya terpendek
- Jalankan sampai selesai, baru ambil proses lain
- Versi non-preemptive

**Keuntungan:**
- Minimalisir average waiting time
- Efisien untuk batch processing

**Kerugian:**
- Tidak cocok untuk interactive systems
- Process starvation bisa terjadi jika proses besar terus datang
- Sulit diprediksi burst time terlebih dahulu

**Contoh Timeline:**
```
P1(8) -> P3(2) -> P2(4) -> P4(4) -> P5(5)
[0   8] [8  10] [10 14] [14 18] [18 23]
```

---

### 3. Round Robin (RR)

**Cara Kerja:**
- Setiap proses mendapat jatah waktu CPU (quantum)
- Jika waktu habis tapi proses belum selesai, proses masuk ke belakang queue
- Berguna untuk time-sharing systems

**Parameter:**
- Quantum = jatah waktu untuk setiap proses (default: 4)
- Semakin kecil quantum → semakin banyak context switch
- Semakin besar quantum → menyerupai FCFS

**Keuntungan:**
- Adil untuk semua proses
- Cocok untuk interactive systems
- Tidak ada starvation

**Kerugian:**
- Overhead dari context switching
- Waiting time tergantung pada total processes dan quantum

---

### 4. Priority Scheduling

**Cara Kerja:**
- Setiap proses memiliki priority value
- Priority lebih rendah (1) = lebih penting, prioritas lebih tinggi
- Di antara proses yang tiba, pilih yang priority-nya terendah
- Versi non-preemptive

**Keuntungan:**
- Fleksibel, proses penting bisa diutamakan
- Cocok untuk real-time systems
- Kontrol penuh atas urutan eksekusi

**Kerugian:**
- Proses dengan priority tinggi (rendah) bisa mengalami starvation
- Sulit menentukan priority value yang tepat

---

## 📊 Memahami Metrik

### 1. Arrival Time
Waktu ketika proses tiba di system (dalam satuan waktu)

### 2. Burst Time
Lama waktu proses berjalan sampai selesai (dalam satuan waktu)

### 3. Priority
Tingkat prioritas proses (untuk Priority Scheduling)
- 1 = sangat penting
- 2 = penting
- 3 = normal

### 4. Waiting Time
**Rumus:** Start Time - Arrival Time

Waktu proses menunggu di queue sebelum dijalankan

**Pentingnya:** Menunjukkan responsiveness sistem
- Lebih kecil = lebih baik

### 5. Response Time
**Rumus:** Start Time - Arrival Time (sama dengan waiting time di scheduling ini)

Waktu dari proses tiba hingga pertama kali dijalankan

**Pentingnya:** Penting untuk interactive systems

### 6. Turnaround Time
**Rumus:** End Time - Arrival Time

Total waktu dari proses tiba hingga selesai dieksekusi

**Pentingnya:** Menunjukkan efficiency sistem

### 7. Throughput
**Rumus:** Number of Processes / Total Completion Time

Jumlah proses yang selesai per unit waktu

**Pentingnya:** Menunjukkan productivity sistem

---

## 🎮 Cara Menggunakan Aplikasi

### 1. Input Data Proses

#### Cara Manual:
1. Klik "Tambah Proses Baru"
2. Isi data:
   - ID Proses: P1, P2, dst
   - Arrival Time: kapan proses tiba
   - Burst Time: durasi eksekusi
   - Priority: (1-3) untuk Priority Scheduling
3. Klik "Tambah Proses"

#### Cara Cepat:
- Klik tombol "Random" untuk auto-generate data
- Klik "Reset" untuk kembali ke data default

#### Mengubah Quantum (Round Robin):
- Ubah nilai di input "Quantum (untuk Round Robin)"
- Semakin kecil quantum, semakin sering context switch

### 2. Lihat Hasil Penjadwalan

1. Pilih algoritma dengan button di atas Gantt Chart:
   - FCFS
   - SJF
   - Round Robin (Q=X)
   - Priority Scheduling

2. Observasi Gantt Chart:
   - Warna berbeda untuk setiap proses
   - Blok menunjukkan waktu eksekusi
   - Spacing menunjukkan idle time

### 3. Animasi Gantt Chart

**Controls:**
- **Play/Pause**: Mulai/hentikan animasi
- **Prev/Next**: Step-by-step satu per satu
- **Reset**: Kembali ke awal
- **Speed**: 0.5x, 1x, 2x, 4x

**Cara Membaca:**
- Garis merah = current time
- Blok yang sudah melewati garis = sudah dieksekusi
- Blok di depan garis = akan dieksekusi

### 4. Analisis Metrik

Di side panel kanan:

**"Algoritma Terbaik" section:**
- Menunjukkan algoritma dengan metrik terbaik
- Di-highlight dengan warna berbeda

**"Ringkasan Metrik" table:**
- Perbandingan waiting time, response time, turnaround time
- Algoritma terbaik dalam setiap kategori di-bold

### 5. Detail Proses

Di bagian bawah, klik pada row proses di tabel untuk:
- Melihat detail lengkap proses
- Visualisasi timeline individu
- Statistik waiting, response, turnaround time

---

## 💡 Tips & Tricks

### 1. Menguji Stabilitas Algoritma
- Generate random proses berkali-kali
- Perhatikan apakah algoritma konsisten unggul atau tergantung data

### 2. Observasi Convoy Effect di FCFS
- Buat proses pertama dengan burst time sangat besar
- Lihat bagaimana proses kecil menunggu lama

### 3. Mengurangi Context Switch di RR
- Tingkatkan quantum value
- Perhatikan bagaimana efficiency meningkat (tapi fairness berkurang)

### 4. Testing Starvation di Priority Scheduling
- Buat beberapa proses dengan priority rendah
- Terus add proses baru dengan priority tinggi
- Observasi apakah proses priority rendah di-execute

### 5. Best Case Scenario
- FCFS: Semua proses memiliki burst time sama
- SJF: Proses kecil tiba lebih dulu
- RR: Semua proses memiliki burst time sama
- Priority: Proses penting tiba terlebih dahulu

---

## 📈 Analisis Hasil untuk Laporan

### Kesimpulan yang Bisa Diambil

1. **FCFS:**
   - ✅ Sederhana, fair
   - ❌ Convoy effect, waiting time tinggi

2. **SJF:**
   - ✅ Mengurangi average waiting time
   - ❌ Unfair, sulit prediksi burst time

3. **RR:**
   - ✅ Fair, cocok untuk interactive
   - ❌ Context switch overhead

4. **Priority:**
   - ✅ Flexible, responsive untuk proses penting
   - ❌ Bisa starvation

### Rekomendasi Penggunaan

| Scenario | Algoritma | Alasan |
|----------|-----------|--------|
| Batch Processing | SJF | Minimize average waiting time |
| Interactive System | RR | Fair dan responsive |
| Real-time System | Priority | Proses critical dijalankan dulu |
| Simple System | FCFS | Implementasi mudah |

---

## 🔧 Troubleshooting

**Q: Hasil simulasi tidak sesuai ekspektasi?**
A: Pastikan:
- Arrival time sudah benar
- Burst time > 0
- Quantum > 0 untuk RR
- Priority value 1-3 (untuk consistency)

**Q: Animasi terasa lambat?**
A: Gunakan Speed control (2x atau 4x)

**Q: Ingin export hasil untuk laporan?**
A: Screenshot dari browser atau copy-paste tabel (fitur export bisa dikembangkan)

---

## 🎯 Kontribusi untuk Laporan

Gunakan hasil simulasi ini untuk:
1. Tabel perbandingan 4 algoritma
2. Chart visualisasi Gantt
3. Analisis metrik
4. Rekomendasi algoritma untuk berbagai use case
5. Kesimpulan tentang trade-off setiap algoritma

---

**Selamat menggunakan CPU Scheduling Simulator! 🚀**
