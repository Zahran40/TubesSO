import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ProcessResultsTable({ results, selectedProcess, setSelectedProcess }) {
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sort processes
  const sortedProcesses = [...results.processStats].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-primary" />
      : <ChevronDown className="w-4 h-4 text-primary" />;
  };

  const headers = [
    { key: 'id', label: 'Process ID' },
    { key: 'arrivalTime', label: 'Arrival Time' },
    { key: 'burstTime', label: 'Burst Time' },
    { key: 'priority', label: 'Priority' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'waitingTime', label: 'Waiting Time' },
    { key: 'responseTime', label: 'Response Time' },
    { key: 'turnaroundTime', label: 'Turnaround Time' },
  ];

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-700 mb-1">Total Processes</p>
          <p className="text-3xl font-bold text-green-900">{results.processStats.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-700 mb-1">Avg Waiting Time</p>
          <p className="text-3xl font-bold text-green-900">{results.averageWaitingTime.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
          <p className="text-xs font-medium text-amber-700 mb-1">Avg Response Time</p>
          <p className="text-3xl font-bold text-amber-900">{results.averageResponseTime.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-xs font-medium text-purple-700 mb-1">Throughput</p>
          <p className="text-3xl font-bold text-purple-900">{results.throughput.toFixed(4)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-300">
            <tr>
              {headers.map(header => (
                <th
                  key={header.key}
                  onClick={() => handleSort(header.key)}
                  className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2 justify-between">
                    {header.label}
                    <SortIcon column={header.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500">
                  Tidak ada data proses
                </td>
              </tr>
            ) : (
              sortedProcesses.map((process, idx) => (
                <tr
                  key={process.id}
                  onClick={() => setSelectedProcess(selectedProcess === process.id ? null : process.id)}
                  className={`border-b border-slate-200 cursor-pointer transition-colors ${
                    selectedProcess === process.id
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: process.color }}
                    />
                    {process.id}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{process.arrivalTime}</td>
                  <td className="px-4 py-3 text-slate-600">{process.burstTime}</td>
                  <td className="px-4 py-3 text-slate-600">{process.priority}</td>
                  <td className="px-4 py-3 text-slate-600">{process.startTime}</td>
                  <td className="px-4 py-3 text-slate-600">{process.endTime}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded font-semibold">
                      {process.waitingTime.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded font-semibold">
                      {process.responseTime.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">
                      {process.turnaroundTime.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Process Details */}
      {selectedProcess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-green-900">
            Detail Process: {selectedProcess}
          </h3>
          
          {sortedProcesses
            .filter(p => p.id === selectedProcess)
            .map(process => (
              <div key={process.id} className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Arrival Time</p>
                    <p className="text-2xl font-bold text-green-900">{process.arrivalTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Burst Time</p>
                    <p className="text-2xl font-bold text-green-900">{process.burstTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Priority</p>
                    <p className="text-2xl font-bold text-green-900">{process.priority}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Start Time</p>
                    <p className="text-2xl font-bold text-green-900">{process.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">End Time</p>
                    <p className="text-2xl font-bold text-green-900">{process.endTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Waiting Time</p>
                    <p className="text-2xl font-bold text-red-600">{process.waitingTime.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-slate-700">{process.responseTime.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 mb-1">Turnaround Time</p>
                    <p className="text-2xl font-bold text-green-600">{process.turnaroundTime.toFixed(2)}</p>
                  </div>
                </div>

                {/* Timeline Visualization */}
                <div className="bg-white p-4 rounded-lg border border-green-200 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Timeline:</p>
                  <div className="flex items-center h-12 bg-white border border-slate-300 rounded">
                    <div
                      className="h-full flex items-center justify-center font-bold text-white text-sm rounded"
                      style={{
                        backgroundColor: process.color,
                        width: `${((process.endTime - process.startTime) / process.endTime) * 100}%`,
                        marginLeft: `${(process.startTime / process.endTime) * 100}%`,
                      }}
                    >
                      {process.id}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 px-2">
                    <span>Start: {process.startTime}</span>
                    <span>End: {process.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
