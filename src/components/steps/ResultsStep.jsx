import { useEffect } from 'react';
import { ChevronLeft, RotateCcw, Clock, Zap, Activity, AlertCircle } from 'lucide-react';
import GanttChart from '../GanttChart';
import MetricsComparison from '../MetricsComparison';
import ProcessResultsTable from '../ProcessResultsTable';
import { useState } from 'react';

export default function ResultsStep({
  simulationResults,
  selectedAlgorithm,
  setSelectedAlgorithm,
  onBack,
  onReset,
}) {
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isResultsOpen, setIsResultsOpen] = useState(true);

  useEffect(() => {
    // We already show a toast in App.jsx when handleRunSimulation is called, 
    // so we don't necessarily need another here, but we can if we want.
  }, [simulationResults]);

  if (!simulationResults) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md w-full shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Belum Ada Hasil</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Tidak ada simulasi yang sedang berjalan. Silakan ke halaman Simulator untuk mengatur proses dan menjalankan simulasi.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-200 transition-all"
          >
            Kembali ke Simulator
          </button>
        </div>
      </div>
    );
  }

  const currentResult = simulationResults[selectedAlgorithm];

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Simulator
          </button>
          
          <div className="flex justify-between items-start bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Hasil Simulasi</h1>
              <p className="text-slate-500">Analisis dan metrik perbandingan algoritma penjadwalan</p>
            </div>
            <button
              onClick={onReset}
              className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              Reset Ulang
            </button>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Object.entries(simulationResults).map(([key, result]) => (
            <button
              key={key}
              onClick={() => setSelectedAlgorithm(key)}
              className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedAlgorithm === key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {result.name}
            </button>
          ))}
        </div>

        {/* Visual Metrics per algorithm */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Metrik Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Avg Waiting</p>
                <p className="text-2xl font-black text-slate-900">{currentResult.averageWaitingTime.toFixed(2)}<span className="text-sm font-medium text-slate-400 ml-1">ms</span></p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Avg Turnaround</p>
                <p className="text-2xl font-black text-slate-900">{currentResult.averageTurnaroundTime.toFixed(2)}<span className="text-sm font-medium text-slate-400 ml-1">ms</span></p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Avg Response</p>
                <p className="text-2xl font-black text-slate-900">{currentResult.averageResponseTime.toFixed(2)}<span className="text-sm font-medium text-slate-400 ml-1">ms</span></p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4 relative overflow-hidden">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center shrink-0">
                <div className="font-bold text-lg">T</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Throughput</p>
                <p className="text-2xl font-black text-white">{currentResult.throughput.toFixed(4)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            Gantt Chart - {currentResult.name}
          </h2>
          <GanttChart timeline={currentResult?.timeline || []} />
          <p className="text-sm text-slate-500 mt-4 border-t border-slate-100 pt-4">
            Visualisasi alokasi CPU dari waktu ke waktu. Blok warna menunjukkan proses mana yang sedang dieksekusi.
          </p>
        </div>

        {/* Stacked Layout for details */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
              Perbandingan Keseluruhan
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Ringkasan metrik untuk semua algoritma. Algoritma dengan nilai terkecil pada Waiting dan Turnaround Time umumnya lebih baik.
            </p>
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <MetricsComparison results={simulationResults} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                Detail Hasil Penjadwalan
              </h2>

              {/* Close Results (only for detail panel) */}
              {isResultsOpen ? (
                <button
                  type="button"
                  onClick={() => setIsResultsOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition-colors flex items-center gap-2 text-slate-700"
                  aria-label="Tutup hasil"
                >
                  Tutup
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsResultsOpen(true)}
                  className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors flex items-center gap-2 text-blue-700"
                >
                  Tampilkan Hasil
                </button>
              )}
            </div>

            {isResultsOpen ? (
              <div className="flex-1">
                <ProcessResultsTable
                  results={currentResult}
                  selectedProcess={selectedProcess}
                  setSelectedProcess={setSelectedProcess}
                />
              </div>
            ) : (
              <div className="mt-6 bg-slate-50 rounded-xl border border-slate-100 p-4 text-sm text-slate-600">
                Detail hasil disembunyikan. Klik <span className="font-bold">Tampilkan Hasil</span> untuk melihat kembali.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
