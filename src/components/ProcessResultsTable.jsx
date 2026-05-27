import { ChevronDown, ChevronUp, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { askAgent } from '../services/ai';

export default function ProcessResultsTable({ results, selectedProcess, setSelectedProcess }) {
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // AI Chat states
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMsg = { role: 'user', content: currentMessage };
    const currentHistory = [...chatHistory];
    setChatHistory([...currentHistory, userMsg]);
    setCurrentMessage('');
    setIsAiTyping(true);

    const metrics = {
      averageWaitingTime: results.averageWaitingTime,
      averageResponseTime: results.averageResponseTime,
      throughput: results.throughput,
      processes: results.processStats
    };

    const aiResponse = await askAgent(metrics, results.timeline || [], currentMessage, currentHistory);
    
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsAiTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

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

      {/* AI Ask Agent Section */}
      <div className="bg-white border-2 border-green-100 rounded-xl overflow-hidden shadow-sm mt-8">
        <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-600 text-white rounded-lg shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-green-900">AI Ask Agent</h3>
            <p className="text-xs text-green-700">Tanyakan apapun tentang hasil penjadwalan CPU ini</p>
          </div>
        </div>
        
        <div className="h-64 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {chatHistory.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-10">
              Kirim pesan untuk mulai bertanya kepada AI.
            </div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-green-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">AI sedang berpikir...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Contoh: Mengapa P2 memiliki waiting time yang tinggi?"
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              disabled={isAiTyping}
            />
            <button
              type="submit"
              disabled={!currentMessage.trim() || isAiTyping}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="font-semibold text-sm">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
