import { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle2, PlayCircle, FolderOpen } from 'lucide-react';

export default function DashboardStep({ setStep, onLoadHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history:', err);
        setLoading(false);
      });
  }, []);

  // Calculate dynamic stats
  const totalSimulations = history.length;
  
  let bestWaitTimeAlgo = '-';
  if (totalSimulations > 0) {
    // just look at the most recent simulation to find the best algorithm wait time
    const recent = history[0];
    let bestVal = Infinity;
    for (const [key, result] of Object.entries(recent.results)) {
      if (result.averageWaitingTime < bestVal) {
        bestVal = result.averageWaitingTime;
        bestWaitTimeAlgo = result.name;
      }
    }
  }

  const stats = [
    { label: 'Total Simulasi (Lokal)', value: totalSimulations.toString(), icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Algoritma Tersedia', value: '4', icon: BarChart3, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Avg Wait Terbaik (Terbaru)', value: bestWaitTimeAlgo, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Status Server', value: 'Aktif', icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Dashboard</h1>
            <p className="text-slate-500">Ringkasan aktivitas dan metrik simulasi penjadwalan CPU</p>
          </div>
          <button 
            onClick={() => setStep('simulator')}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm shadow-green-200 transition-all flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            Mulai Simulasi Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 truncate max-w-[120px]" title={stat.value}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Simulations Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-slate-400" /> Riwayat Tersimpan Lokal
            </h2>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID Simulasi</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Waktu</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Algoritma Pilihan</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Jml Proses</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Memuat riwayat...</td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Belum ada riwayat simulasi yang tersimpan di lokal.</td>
                  </tr>
                ) : (
                  history.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group" onClick={() => onLoadHistory(entry)}>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">{entry.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(entry.date).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md uppercase tracking-wide">
                          {entry.selectedAlgorithm}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{entry.processes.length} Proses</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm font-semibold text-green-600 hover:text-green-800">
                          Buka Hasil →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
