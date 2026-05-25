import { useState } from 'react';
import { Trash2, Plus, Zap, RefreshCw } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function ProcessInput({ processes, setProcesses, quantum, setQuantum }) {
  const [formData, setFormData] = useState({
    id: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });

  const [showForm, setShowForm] = useState(false);

  const handleAddProcess = (e) => {
    e.preventDefault();
    
    if (!formData.id.trim()) {
      alert('ID proses tidak boleh kosong');
      return;
    }

    if (processes.some(p => p.id === formData.id)) {
      alert('ID proses sudah ada');
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
    setFormData({ id: '', arrivalTime: 0, burstTime: 1, priority: 1 });
    setShowForm(false);
  };

  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const generateRandomProcesses = () => {
    const baseProcesses = [];
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 proses
    
    for (let i = 0; i < count; i++) {
      baseProcesses.push({
        id: `P${i + 1}`,
        arrivalTime: Math.floor(i * 1),
        burstTime: Math.floor(Math.random() * 8) + 1,
        priority: Math.floor(Math.random() * 3) + 1,
        color: COLORS[i % COLORS.length],
      });
    }
    
    setProcesses(baseProcesses);
  };

  const resetProcesses = () => {
    setProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3, color: '#3B82F6' },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, color: '#10B981' },
      { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 3, color: '#F59E0B' },
      { id: 'P4', arrivalTime: 3, burstTime: 4, priority: 2, color: '#EF4444' },
      { id: 'P5', arrivalTime: 4, burstTime: 5, priority: 2, color: '#8B5CF6' },
    ]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Konfigurasi Proses
        </h2>
        <div className="flex gap-2">
          <button
            onClick={generateRandomProcesses}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-amber-500 transition-colors font-medium"
          >
            <Zap className="w-4 h-4" />
            Random
          </button>
          <button
            onClick={resetProcesses}
            className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Quantum Input */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Quantum (untuk Round Robin)
        </label>
        <input
          type="number"
          min="1"
          value={quantum}
          onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>

      {/* Process List */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">ID Proses</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Arrival Time</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Burst Time</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Color</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {processes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  Belum ada proses. Tambahkan proses baru atau gunakan tombol "Random".
                </td>
              </tr>
            ) : (
              processes.map(process => (
                <tr key={process.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{process.id}</td>
                  <td className="px-4 py-3 text-slate-600">{process.arrivalTime}</td>
                  <td className="px-4 py-3 text-slate-600">{process.burstTime}</td>
                  <td className="px-4 py-3 text-slate-600">{process.priority}</td>
                  <td className="px-4 py-3">
                    <div
                      className="w-6 h-6 rounded border border-slate-300"
                      style={{ backgroundColor: process.color }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteProcess(process.id)}
                      className="text-danger hover:text-red-700 font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Process Form */}
      {showForm ? (
        <form onSubmit={handleAddProcess} className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="ID Proses (P1, P2, ...)"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <input
              type="number"
              placeholder="Arrival Time"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <input
              type="number"
              placeholder="Burst Time"
              value={formData.burstTime}
              onChange={(e) => setFormData({ ...formData, burstTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="1"
            />
            <input
              type="number"
              placeholder="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="1"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
            >
              Tambah Proses
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-green-600 font-medium transition-colors justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Proses Baru
        </button>
      )}
    </div>
  );
}
