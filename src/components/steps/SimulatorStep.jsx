import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Zap, Play, RotateCcw } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function SimulatorStep({
  processes,
  setProcesses,
  selectedAlgorithm,
  setSelectedAlgorithm,
  quantum,
  setQuantum,
  onRun,
}) {
  const [formData, setFormData] = useState({
    id: '',
    arrivalTime: '',
    burstTime: '',
    priority: '',
  });

  const algorithms = [
    { id: 'fcfs', name: 'FCFS', desc: 'First Come, First Served' },
    { id: 'sjf', name: 'SJF', desc: 'Shortest Job First' },
    { id: 'roundRobin', name: 'Round Robin', desc: 'Time-sharing' },
    { id: 'priority', name: 'Priority', desc: 'Priority Scheduling' },
  ];

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.arrivalTime || !formData.burstTime || !formData.priority) {
      toast.error('Semua field harus diisi');
      return;
    }
    if (processes.some(p => p.id.toLowerCase() === formData.id.toLowerCase())) {
      toast.error('ID proses sudah ada');
      return;
    }
    const colorIndex = processes.length % COLORS.length;
    const newProcess = {
      ...formData,
      id: formData.id.toUpperCase(),
      arrivalTime: Number(formData.arrivalTime),
      burstTime: Number(formData.burstTime),
      priority: Number(formData.priority),
      color: COLORS[colorIndex],
    };
    setProcesses([...processes, newProcess]);
    setFormData({ id: '', arrivalTime: '', burstTime: '', priority: '' });
    toast.success(`Proses ${newProcess.id} berhasil ditambahkan`);
  };

  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
    toast.success(`Proses ${id} dihapus`);
  };

  const generateRandom = () => {
    const randomProcesses = [];
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 processes
    for (let i = 0; i < count; i++) {
      randomProcesses.push({
        id: `P${i + 1}`,
        arrivalTime: i,
        burstTime: Math.floor(Math.random() * 8) + 1,
        priority: Math.floor(Math.random() * 3) + 1,
        color: COLORS[i % COLORS.length],
      });
    }
    setProcesses(randomProcesses);
    toast.success('Proses acak berhasil dibuat');
  };

  const resetProcesses = () => {
    setProcesses([]);
    setFormData({ id: '', arrivalTime: '', burstTime: '', priority: '' });
    toast.success('Semua proses direset');
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Simulator Penjadwalan</h1>
          <p className="text-slate-500">Pilih algoritma dan konfigurasi antrian proses untuk disimulasikan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Algorithm Selection */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h2 className="text-lg font-bold text-slate-900">Pilih Algoritma</h2>
              </div>
              
              <div className="space-y-3">
                {algorithms.map(algo => (
                  <label 
                    key={algo.id}
                    className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedAlgorithm === algo.id 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center h-5">
                      <input 
                        type="radio" 
                        name="algorithm" 
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                        checked={selectedAlgorithm === algo.id}
                        onChange={() => setSelectedAlgorithm(algo.id)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className={`block font-bold ${selectedAlgorithm === algo.id ? 'text-blue-900' : 'text-slate-900'}`}>
                        {algo.name}
                      </span>
                      <span className={`block mt-0.5 ${selectedAlgorithm === algo.id ? 'text-blue-700' : 'text-slate-500'}`}>
                        {algo.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {selectedAlgorithm === 'roundRobin' && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Quantum Time</label>
                  <input
                    type="number"
                    value={quantum}
                    onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    min="1"
                  />
                  <p className="text-xs text-slate-600 mt-2">Jatah waktu eksekusi setiap proses</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Process Configuration */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Konfigurasi Proses</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={generateRandom} className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Acak
                  </button>
                  <button onClick={resetProcesses} className="px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>

              {/* Add Process Form */}
              <form onSubmit={handleAddProcess} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1" title="ID unik untuk setiap proses (misal: P1)">ID (Unik)</label>
                  <input type="text" placeholder="P1" required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${processes.some(p => p.id.toLowerCase() === formData.id.toLowerCase()) && formData.id !== '' ? 'border-red-500 text-red-600' : 'border-slate-300 focus:border-blue-500'}`} />
                  {processes.some(p => p.id.toLowerCase() === formData.id.toLowerCase()) && formData.id !== '' && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">ID sudah digunakan</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1" title="Waktu kedatangan proses, tidak boleh kurang dari 0">Arrival Time (≥ 0)</label>
                  <input type="number" placeholder="0" required value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formData.arrivalTime !== '' && Number(formData.arrivalTime) < 0 ? 'border-red-500 text-red-600' : 'border-slate-300 focus:border-blue-500'}`} min="0" />
                  {formData.arrivalTime !== '' && Number(formData.arrivalTime) < 0 && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">Minimal 0</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1" title="Waktu eksekusi yang dibutuhkan, minimal 1">Burst Time (≥ 1)</label>
                  <input type="number" placeholder="1" required value={formData.burstTime} onChange={e => setFormData({...formData, burstTime: e.target.value})} className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formData.burstTime !== '' && Number(formData.burstTime) < 1 ? 'border-red-500 text-red-600' : 'border-slate-300 focus:border-blue-500'}`} min="1" />
                  {formData.burstTime !== '' && Number(formData.burstTime) < 1 && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">Minimal 1</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1" title="Prioritas proses (angka lebih kecil = prioritas tinggi), minimal 1">Priority (≥ 1)</label>
                  <input type="number" placeholder="1" required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formData.priority !== '' && Number(formData.priority) < 1 ? 'border-red-500 text-red-600' : 'border-slate-300 focus:border-blue-500'}`} min="1" />
                  {formData.priority !== '' && Number(formData.priority) < 1 && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">Minimal 1</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1 opacity-0 pointer-events-none">Tambah</label>
                  <button type="submit" className="w-full h-[38px] bg-slate-900 text-white rounded-lg hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all flex items-center justify-center gap-1.5 text-sm font-semibold group disabled:opacity-50 disabled:cursor-not-allowed" disabled={processes.some(p => p.id.toLowerCase() === formData.id.toLowerCase()) && formData.id !== ''}>
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Tambah
                  </button>
                </div>
              </form>

              {/* Processes Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">AT</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">BT</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Priority</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Warna</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                          Belum ada proses. Tambahkan proses atau gunakan tombol "Acak".
                        </td>
                      </tr>
                    ) : (
                      processes.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-900">{p.id}</td>
                          <td className="px-4 py-3 text-slate-600">{p.arrivalTime}</td>
                          <td className="px-4 py-3 text-slate-600">{p.burstTime}</td>
                          <td className="px-4 py-3 text-slate-600">{p.priority}</td>
                          <td className="px-4 py-3">
                            <div className="w-5 h-5 rounded border border-slate-200 shadow-sm" style={{ backgroundColor: p.color }} />
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteProcess(p.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => {
                if (processes.length === 0) {
                  toast.error('Tambahkan minimal 1 proses terlebih dahulu');
                  return;
                }
                onRun();
              }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Play className="w-6 h-6 fill-white" /> Jalankan Simulasi Sekarang
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
