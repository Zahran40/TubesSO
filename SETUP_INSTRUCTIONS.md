## Project Setup Instructions

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm atau yarn package manager

### Installation Steps

#### 1. Install Dependencies (if not already done)

```bash
cd c:\laragon\www\TubesSO
npm install
```

Tunggu hingga proses selesai (bisa memakan waktu beberapa menit).

Jika mengalami error PowerShell execution policy, gunakan command prompt:
```bash
cmd /c "npm install"
```

#### 2. Verify Installation

```bash
npm list --depth=0
```

Seharusnya semua package terinstall:
- react
- react-dom
- recharts
- lucide-react
- tailwindcss
- vite
- dst

#### 3. Start Development Server

```bash
npm run dev
```

Server akan otomatis membuka di `http://localhost:5173`

### File Structure

```
TubesSO/
├── src/
│   ├── App.jsx                    # Main component
│   ├── main.jsx                   # Entry point
│   ├── index.css                  # Global styles with Tailwind
│   ├── algorithms/
│   │   └── schedulingAlgorithms.js # All 4 scheduling algorithms
│   ├── components/
│   │   ├── ProcessInput.jsx       # Form and process management
│   │   ├── GanttChart.jsx         # Gantt chart visualization
│   │   ├── MetricsComparison.jsx  # Metrics comparison table
│   │   └── ProcessResultsTable.jsx # Detailed process results
│   └── hooks/                     # (Future custom hooks)
├── public/                        # Static files
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── README.md                      # Project documentation
├── PANDUAN_PENGGUNAAN.md         # Indonesian usage guide
└── SETUP_INSTRUCTIONS.md         # This file
```

### Customization

#### Mengubah Quantum Default (Round Robin)
Edit file: `src/App.jsx`
Baris: `const [quantum, setQuantum] = useState(4);`
Ubah nilai 4 menjadi quantum default yang diinginkan.

#### Mengubah Default Processes
Edit file: `src/App.jsx`
Baris: `const [processes, setProcesses] = useState([...])`
Modifikasi array proses sesuai kebutuhan.

#### Mengubah Color Scheme
Edit file: `src/components/ProcessInput.jsx`
Baris: `const COLORS = [...]`
Atau ubah di `tailwind.config.js` untuk theme colors global.

### Build untuk Production

```bash
npm run build
```

Output akan tersimpan di folder `dist/`. Bisa di-deploy ke:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

### Troubleshooting

#### Port 5173 sudah terpakai
Vite akan otomatis menggunakan port berikutnya (5174, 5175, dst)

#### npm install stuck/timeout
```bash
# Clear cache
npm cache clean --force

# Retry dengan verbose
npm install --verbose

# Atau gunakan yarn jika sudah terinstall
yarn install
```

#### Module not found errors
```bash
# Remove node_modules dan reinstall
rm -r node_modules
npm install
```

#### Build error "cannot find module"
```bash
# Clear dist folder
rm -r dist

# Rebuild
npm run build
```

### Performance Tips

1. **Untuk dataset besar:**
   - Quantum = 1 (lebih kecil lebih cepat)
   - Disable animations untuk instant results
   
2. **Untuk smooth animations:**
   - Gunakan Speed 1x atau lebih kecil
   - Browser modern (Chrome, Firefox, Edge)

### Browser Compatibility

✅ Chrome/Chromium (88+)
✅ Firefox (87+)
✅ Safari (14+)
✅ Edge (88+)

### Next Steps

1. Run development server: `npm run dev`
2. Open `http://localhost:5173` di browser
3. Ikuti panduan di PANDUAN_PENGGUNAAN.md
4. Experiment dengan berbagai data untuk simulasi

### Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

### Support & Questions

Jika mengalami masalah:
1. Check error message di terminal
2. Verify semua dependencies terinstall
3. Try clearing cache dan reinstall
4. Check documentation files dalam project

Happy Coding! 🚀
