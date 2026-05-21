import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GanttChart({ timeline }) {
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Hitung max time dan scale
  const maxTime = useMemo(() => {
    if (timeline.length === 0) return 10;
    return Math.max(...timeline.map(t => t.endTime)) + 2;
  }, [timeline]);

  const pixelsPerUnit = useMemo(() => {
    const chartWidth = 800;
    return chartWidth / maxTime;
  }, [maxTime]);

  // Animasi
  const displayTimeline = useMemo(() => {
    if (!isPlaying) return timeline;
    return timeline
      .map(t => {
        if (t.startTime >= currentTime) return null;
        if (t.endTime <= currentTime) return t;
        return { ...t, endTime: currentTime };
      })
      .filter(Boolean);
  }, [timeline, isPlaying, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    if (currentTime < maxTime) {
      setCurrentTime(prev => prev + 0.5);
    }
  };

  const handlePrevStep = () => {
    if (currentTime > 0) {
      setCurrentTime(prev => prev - 0.5);
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Simulasi animasi
  useEffect(() => {
    if (!isPlaying) return;
    const start = Date.now();
    let last = start;
    const id = setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000; // seconds
      last = now;
      setCurrentTime(prev => {
        const next = prev + dt * (1 * animationSpeed);
        if (next >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(id);
  }, [isPlaying, maxTime, animationSpeed]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handlePrevStep}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextStep}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
        
        <div className="flex-1 flex items-center gap-2 ml-auto">
          <label className="text-sm font-medium text-slate-700">Speed:</label>
          <select
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="overflow-x-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="min-w-max">
          {/* Time Axis */}
          <div className="flex gap-2 mb-2">
            <div className="w-24 flex-shrink-0"></div>
            <div className="flex-grow relative h-8 border-b border-slate-200">
              {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-slate-300 pl-1 text-xs font-semibold text-slate-600"
                  style={{ left: `${(i / maxTime) * 100}%` }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          {/* Processes */}
          {displayTimeline.length > 0 ? (
            <div className="space-y-1">
              {/* Kelompokkan timeline berdasarkan processId */}
              {Object.keys(
                displayTimeline.reduce((acc, item) => {
                  if (!acc[item.processId]) acc[item.processId] = [];
                  acc[item.processId].push(item);
                  return acc;
                }, {})
              ).map(processId => (
                <div key={processId} className="flex items-center gap-2">
                  <div className="w-24 flex-shrink-0 font-semibold text-sm text-slate-900">
                    {processId}
                  </div>
                  <div className="flex-grow relative h-10 bg-white border border-slate-200 rounded">
                    {displayTimeline
                      .filter(t => t.processId === processId)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="absolute h-full flex items-center justify-center font-bold text-white text-xs border-r border-white/50 rounded hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: item.color,
                            left: `${(item.startTime / maxTime) * 100}%`,
                            width: `${((item.endTime - item.startTime) / maxTime) * 100}%`,
                            overflow: 'hidden',
                          }}
                        >
                          {processId}
                        </div>
                      ))}
                  </div>
                  <div className="w-20 flex-shrink-0 text-right text-xs text-slate-600">
                    {displayTimeline
                      .filter(t => t.processId === processId)
                      .map(t => `[${t.startTime}-${t.endTime}]`)
                      .join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Tidak ada data penjadwalan
            </div>
          )}

          {/* Current Time Indicator */}
          {isPlaying && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-24 flex-shrink-0"></div>
              <div
                className="h-8 w-1 bg-red-500 transition-all"
                style={{ marginLeft: `${(currentTime / maxTime) * 100}%` }}
              />
              <div className="text-sm font-bold text-red-600">
                Current Time: {currentTime.toFixed(1)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-1">Total Time</p>
          <p className="text-2xl font-bold text-slate-900">
            {timeline.length > 0 ? Math.max(...timeline.map(t => t.endTime)) : 0}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-1">Processes</p>
          <p className="text-2xl font-bold text-slate-900">
            {new Set(displayTimeline.map(t => t.processId)).size}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-1">Tasks</p>
          <p className="text-2xl font-bold text-slate-900">
            {displayTimeline.length}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-1">Progress</p>
          <p className="text-2xl font-bold text-slate-900">
            {isPlaying
              ? `${((currentTime / maxTime) * 100).toFixed(0)}%`
              : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
}
