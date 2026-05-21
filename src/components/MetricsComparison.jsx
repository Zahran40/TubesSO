import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingDown } from 'lucide-react';

export default function MetricsComparison({ results }) {
  // Prepare data for comparison chart
  const comparisonData = [
    {
      name: 'Avg Wait Time',
      FCFS: parseFloat(results.fcfs.averageWaitingTime.toFixed(2)),
      SJF: parseFloat(results.sjf.averageWaitingTime.toFixed(2)),
      'Round Robin': parseFloat(results.roundRobin.averageWaitingTime.toFixed(2)),
      'Priority': parseFloat(results.priority.averageWaitingTime.toFixed(2)),
    },
    {
      name: 'Avg Response Time',
      FCFS: parseFloat(results.fcfs.averageResponseTime.toFixed(2)),
      SJF: parseFloat(results.sjf.averageResponseTime.toFixed(2)),
      'Round Robin': parseFloat(results.roundRobin.averageResponseTime.toFixed(2)),
      'Priority': parseFloat(results.priority.averageResponseTime.toFixed(2)),
    },
    {
      name: 'Avg Turnaround',
      FCFS: parseFloat(results.fcfs.averageTurnaroundTime.toFixed(2)),
      SJF: parseFloat(results.sjf.averageTurnaroundTime.toFixed(2)),
      'Round Robin': parseFloat(results.roundRobin.averageTurnaroundTime.toFixed(2)),
      'Priority': parseFloat(results.priority.averageTurnaroundTime.toFixed(2)),
    },
  ];

  // Find best algorithms
  const bestWaitTime = Math.min(
    results.fcfs.averageWaitingTime,
    results.sjf.averageWaitingTime,
    results.roundRobin.averageWaitingTime,
    results.priority.averageWaitingTime
  );

  const bestResponseTime = Math.min(
    results.fcfs.averageResponseTime,
    results.sjf.averageResponseTime,
    results.roundRobin.averageResponseTime,
    results.priority.averageResponseTime
  );

  const bestThroughput = Math.max(
    results.fcfs.throughput,
    results.sjf.throughput,
    results.roundRobin.throughput,
    results.priority.throughput
  );

  const getBestAlgorithmName = (metricName) => {
    let bestValue = 0;
    if (metricName === 'waitTime') bestValue = bestWaitTime;
    else if (metricName === 'responseTime') bestValue = bestResponseTime;
    else if (metricName === 'throughput') bestValue = bestThroughput;

    const bestAlgos = [];
    for (const [key, result] of Object.entries(results)) {
      let val = 0;
      if (metricName === 'waitTime') val = result.averageWaitingTime;
      else if (metricName === 'responseTime') val = result.averageResponseTime;
      else if (metricName === 'throughput') val = result.throughput;

      // Use a small epsilon for floating point comparison
      if (Math.abs(val - bestValue) < 0.0001) {
        bestAlgos.push(result.name);
      }
    }

    if (bestAlgos.length === Object.keys(results).length) {
      return "Semua Sama (Identik)";
    }
    return bestAlgos.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Best Algorithms */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          Algoritma Terbaik
        </h3>
        
        <div className="space-y-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-600">Waiting Time Terendah</p>
            <p className="text-lg font-bold text-green-700">{getBestAlgorithmName('waitTime')}</p>
            <p className="text-sm text-slate-600">{bestWaitTime.toFixed(2)}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-600">Response Time Terendah</p>
            <p className="text-lg font-bold text-blue-700">{getBestAlgorithmName('responseTime')}</p>
            <p className="text-sm text-slate-600">{bestResponseTime.toFixed(2)}</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-600">Throughput Tertinggi</p>
            <p className="text-lg font-bold text-purple-700">{getBestAlgorithmName('throughput')}</p>
            <p className="text-sm text-slate-600">{bestThroughput.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Ringkasan Metrik</h3>
        
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Algoritma</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Wait</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Response</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([key, result]) => (
                <tr key={key} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">{result.name}</td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    <span className={result.averageWaitingTime === bestWaitTime ? 'font-bold text-green-600' : ''}>
                      {result.averageWaitingTime.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    <span className={result.averageResponseTime === bestResponseTime ? 'font-bold text-green-600' : ''}>
                      {result.averageResponseTime.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    {result.averageTurnaroundTime.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
