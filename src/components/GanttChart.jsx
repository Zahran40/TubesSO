import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, BarChart3, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { generateStory } from '../services/ai';

// Component for the Geometry Dash Cube Character
function GeometryDashCube({ color, faceType, isJumping, size = 28 }) {
  const getFace = () => {
    switch (faceType) {
      case 'cool':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1 fill-cyan-400 stroke-black stroke-[8] stroke-linejoin-round">
            {/* Sunglasses */}
            <polygon points="10,25 90,25 80,45 55,45 50,35 45,45 20,45" />
            <line x1="10" y1="25" x2="90" y2="25" />
            {/* Smirk Mouth */}
            <path d="M 30 70 Q 55 80 70 65" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      case 'happy':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 fill-none stroke-black stroke-[8] stroke-linecap-round">
            {/* Happy Eyes ^ ^ */}
            <path d="M 20 40 L 35 25 L 50 40" strokeWidth="10" strokeLinejoin="round" />
            <path d="M 50 40 L 65 25 L 80 40" strokeWidth="10" strokeLinejoin="round" />
            {/* Open Happy Mouth */}
            <path d="M 25 60 Q 50 85 75 60 Z" fill="cyan" strokeWidth="8" />
          </svg>
        );
      case 'surprised':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 fill-cyan-300 stroke-black stroke-[8]">
            {/* Big Round Eyes */}
            <circle cx="30" cy="35" r="12" />
            <circle cx="70" cy="35" r="12" />
            {/* Shocked Mouth */}
            <circle cx="50" cy="68" r="10" fill="cyan" />
          </svg>
        );
      case 'determined':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 fill-cyan-300 stroke-black stroke-[8]">
            {/* Angry Eyebrows */}
            <line x1="15" y1="20" x2="45" y2="35" stroke="black" strokeWidth="10" strokeLinecap="round" />
            <line x1="85" y1="20" x2="55" y2="35" stroke="black" strokeWidth="10" strokeLinecap="round" />
            {/* Eyes under eyebrows */}
            <rect x="22" y="38" width="18" height="15" rx="2" />
            <rect x="60" y="38" width="18" height="15" rx="2" />
            {/* Determined Mouth */}
            <line x1="30" y1="70" x2="70" y2="70" stroke="black" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      case 'playful':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 fill-cyan-300 stroke-black stroke-[8]">
            {/* Wink Eye */}
            <path d="M 15 35 Q 30 20 45 35" fill="none" stroke="black" strokeWidth="10" strokeLinecap="round" />
            <rect x="60" y="25" width="22" height="22" rx="4" />
            {/* Wry smile */}
            <path d="M 30 65 Q 40 75 70 60" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      case 'standard':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5 fill-cyan-300 stroke-black stroke-[8]">
            {/* Square Eyes */}
            <rect x="18" y="25" width="22" height="22" rx="4" />
            <rect x="60" y="25" width="22" height="22" rx="4" />
            {/* Flat Mouth */}
            <rect x="20" y="65" width="60" height="14" rx="3" />
          </svg>
        );
    }
  };

  return (
    <div
      className="relative flex items-center justify-center rounded border-2 border-black shadow-md select-none transition-transform duration-75"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        transform: `scale(${isJumping ? '1.12' : '1'})`,
        boxShadow: `0 0 12px ${color}bf, inset 0 0 6px rgba(255,255,255,0.4)`
      }}
    >
      {getFace()}
    </div>
  );
}

export default function GanttChart({ timeline }) {
  const [mode, setMode] = useState('gd'); // 'classic' or 'gd'
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // AI Storyteller states
  const [storySequence, setStorySequence] = useState([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);

  const containerRef = useRef(null);

  // States for GD animations
  const [prevActiveId, setPrevActiveId] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [trail, setTrail] = useState([]);

  // Hitung max time dan scale
  const maxTime = useMemo(() => {
    if (timeline.length === 0) return 10;
    return Math.max(...timeline.map(t => t.endTime)) + 2;
  }, [timeline]);

  const pixelsPerUnit = useMemo(() => {
    const chartWidth = 800;
    return chartWidth / maxTime;
  }, [maxTime]);

  const levelWidth = useMemo(() => {
    if (timeline.length === 0) return 800;
    return Math.max(800, maxTime * 55);
  }, [timeline, maxTime]);

  // Unique Process IDs ordered stably
  const uniqueProcessIds = useMemo(() => {
    const ids = [];
    timeline.forEach(t => {
      if (!ids.includes(t.processId)) {
        ids.push(t.processId);
      }
    });
    return ids.sort();
  }, [timeline]);

  // Execution Order IDs (based on actual execution order)
  const executionOrderIds = useMemo(() => {
    const ids = [];
    timeline.forEach(t => {
      if (!ids.includes(t.processId)) {
        ids.push(t.processId);
      }
    });
    return ids;
  }, [timeline]);

  // Active process details
  const activeInterval = useMemo(() => {
    return timeline.find(t => currentTime >= t.startTime && currentTime < t.endTime) || null;
  }, [timeline, currentTime]);

  const cubeBottom = useMemo(() => {
    if (!activeInterval) {
      return 15; // idle ground level
    }
    const idx = uniqueProcessIds.indexOf(activeInterval.processId);
    if (idx === -1) return 15;
    
    // Bottom baseline coordinates of the process track
    const laneBottom = (uniqueProcessIds.length - 1 - idx) * 64 + 30;
    return laneBottom + 24; // elevated sitting on the platform
  }, [activeInterval, uniqueProcessIds]);

  // Animasi
  const displayTimeline = useMemo(() => {
    return timeline
      .map(t => {
        if (t.startTime >= currentTime) return null;
        if (t.endTime <= currentTime) return t;
        return { ...t, endTime: currentTime };
      })
      .filter(Boolean);
  }, [timeline, currentTime]);

  // Geometry Dash mode timeline: platforms grow/reveal dynamically as currentTime progresses
  const gdDisplayTimeline = useMemo(() => {
    return timeline
      .map(item => {
        if (currentTime <= item.startTime) {
          return null;
        }
        const renderedEndTime = Math.min(currentTime, item.endTime);
        return {
          ...item,
          renderedEndTime
        };
      })
      .filter(Boolean);
  }, [timeline, currentTime]);

  // Find when the last process finishes execution
  const finishTime = useMemo(() => {
    if (timeline.length === 0) return 0;
    return Math.max(...timeline.map(t => t.endTime));
  }, [timeline]);

  const toastShownRef = useRef(false);

  // Reset toastShownRef when currentTime is reset
  useEffect(() => {
    if (currentTime === 0) {
      toastShownRef.current = false;
    }
  }, [currentTime]);

  // Fetch AI Story on timeline change
  useEffect(() => {
    const fetchStory = async () => {
      setIsLoadingStory(true);
      const story = await generateStory(timeline);
      if (story) {
        setStorySequence(story);
      }
      setIsLoadingStory(false);
    };
    if (timeline.length > 0) {
      fetchStory();
    }
  }, [timeline]);

  // Current Story based on time
  const currentStorySnippet = useMemo(() => {
    if (!storySequence || storySequence.length === 0) return null;
    const current = storySequence.find(s => currentTime >= s.startTime && currentTime <= s.endTime);
    if (!current) {
      // Find the last finished one if it's idle at the end
      if (currentTime >= finishTime && storySequence.length > 0) {
         return storySequence[storySequence.length - 1];
      }
      return null;
    }
    return current;
  }, [storySequence, currentTime, finishTime]);

  // Show Toast when the last process completes
  useEffect(() => {
    if (timeline.length > 0 && currentTime >= finishTime && !toastShownRef.current) {
      toast.success('Simulasi Penjadwalan CPU Selesai', {
        description: 'Semua proses telah berhasil dieksekusi oleh CPU.',
        duration: 4000,
        position: 'top-right',
      });
      toastShownRef.current = true;
    }
  }, [currentTime, finishTime, timeline]);

  const handlePlayPause = () => {
    if (currentTime >= finishTime && !isPlaying) {
      setCurrentTime(0);
      setTrail([]);
      setRotation(0);
      if (containerRef.current) {
        containerRef.current.scrollLeft = 0;
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextStep = () => {
    if (currentTime < maxTime) {
      setCurrentTime(prev => {
        const next = prev + 0.5;
        return next > maxTime ? maxTime : next;
      });
    }
  };

  const handlePrevStep = () => {
    if (currentTime > 0) {
      setCurrentTime(prev => {
        const next = prev - 0.5;
        return next < 0 ? 0 : next;
      });
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    setTrail([]);
    setRotation(0);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  };

  // Trigger jumps/rotation on context switches
  useEffect(() => {
    const currentActiveId = activeInterval?.processId || 'idle';
    if (prevActiveId && currentActiveId !== prevActiveId) {
      setRotation(prev => prev + 180);
      setIsJumping(true);
      const timer = setTimeout(() => setIsJumping(false), 250);
      return () => clearTimeout(timer);
    }
    setPrevActiveId(currentActiveId);
  }, [activeInterval, prevActiveId]);

  // Update trail particles
  useEffect(() => {
    if (!isPlaying) {
      setTrail([]);
      return;
    }

    const xPx = (currentTime / maxTime) * levelWidth;
    let yPx = 15;
    if (activeInterval) {
      const idx = uniqueProcessIds.indexOf(activeInterval.processId);
      if (idx !== -1) {
        yPx = (uniqueProcessIds.length - 1 - idx) * 64 + 54;
      }
    }

    setTrail(prev => {
      const next = [...prev, { x: xPx, y: yPx, id: Math.random() }];
      if (next.length > 8) {
        next.shift();
      }
      return next;
    });
  }, [currentTime, isPlaying, activeInterval, maxTime, levelWidth, uniqueProcessIds]);

  // Viewport follow player
  useEffect(() => {
    if (containerRef.current && isPlaying) {
      const container = containerRef.current;
      const progressX = (currentTime / maxTime) * levelWidth;
      const targetScroll = progressX - container.clientWidth * 0.4;
      if (targetScroll > 0) {
        container.scrollLeft = targetScroll;
      } else {
        container.scrollLeft = 0;
      }
    }
  }, [currentTime, isPlaying, maxTime, levelWidth]);

  // Simulasi animasi
  useEffect(() => {
    if (!isPlaying) return;
    const start = Date.now();
    let last = start;
    const id = setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000;
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

  // Spikes and Face selectors
  const generateSpikesForProcess = (processId, timeline, maxTime) => {
    const segments = timeline.filter(t => t.processId === processId);
    const spikes = [];
    
    for (let t = 1.0; t < maxTime - 0.5; t += 2.0) {
      const isExecuting = segments.some(seg => t >= seg.startTime && t < seg.endTime);
      if (!isExecuting) {
        const nearEdge = segments.some(seg => Math.abs(t - seg.startTime) < 0.6 || Math.abs(t - seg.endTime) < 0.6);
        if (!nearEdge) {
          spikes.push(t);
        }
      }
    }
    return spikes;
  };

  const getFaceTypeForProcess = (processId) => {
    const faces = ['standard', 'cool', 'happy', 'surprised', 'determined', 'playful'];
    const num = parseInt(processId.replace(/\D/g, '')) || 0;
    return faces[(num - 1) % faces.length] || 'standard';
  };

  return (
    <div className="w-full space-y-4">
      {/* Tab Mode and Controls Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
        {/* Playback Controls */}
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={handlePlayPause}
            className={`px-5 py-2 text-white font-bold rounded-xl transition-all shadow-sm ${
              isPlaying 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' 
                : 'bg-green-600 hover:bg-green-700 shadow-green-100'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handlePrevStep}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Step Back"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNextStep}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Step Forward"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
          >
            Reset
          </button>
          
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs font-bold text-slate-500">Speed:</span>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </div>
        </div>

        {/* Visualizer Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setMode('classic')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'classic'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Classic Chart
          </button>
          <button
            onClick={() => setMode('gd')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'gd'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Geometry Dash Mode
          </button>
        </div>
      </div>

      {mode === 'classic' ? (
        /* Classic Gantt Chart */
        <div className="overflow-x-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                {uniqueProcessIds.map(processId => (
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
                <div className="flex-grow relative h-8">
                  <div
                    className="absolute top-0 h-full w-1 bg-red-500 transition-all duration-75"
                    style={{ left: `${(currentTime / maxTime) * 100}%` }}
                  />
                  <div 
                    className="absolute top-1 text-sm font-bold text-red-600 transition-all duration-75"
                    style={{ left: `calc(${(currentTime / maxTime) * 100}% + 8px)` }}
                  >
                    Time: {currentTime.toFixed(1)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Geometry Dash Interactive Mode */
        <div className="relative w-full overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-lg p-6 select-none">
          {/* Level Progress Indicator */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              PROCESS LEVEL: {executionOrderIds.join(' → ')}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                TIME: {Math.min(currentTime, finishTime).toFixed(1)} / {finishTime.toFixed(0)}
              </span>
              <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-75"
                  style={{ width: `${finishTime > 0 ? Math.min(100, (currentTime / finishTime) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Game Viewport Container */}
          <div 
            ref={containerRef}
            className="overflow-x-auto overflow-y-hidden border border-slate-100 rounded-xl bg-white relative scroll-smooth"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              animation: isPlaying ? `scrollGrid ${1.5 / animationSpeed}s linear infinite` : 'none',
            }}
          >
            <style>{`
              @keyframes scrollGrid {
                from { background-position-x: 0px; }
                to { background-position-x: -40px; }
              }
            `}</style>

            {/* The Level Content Area */}
            <div 
              className="relative transition-all duration-75"
              style={{
                width: `${levelWidth}px`,
                height: `${uniqueProcessIds.length * 64 + 75}px`
              }}
            >
              {/* Process Track Lane Gridlines */}
              {uniqueProcessIds.map((processId, i) => {
                const laneBottom = (uniqueProcessIds.length - 1 - i) * 64 + 30;
                return (
                  <div 
                    key={`gridline-${processId}`}
                    className="absolute left-0 right-0 border-b border-slate-300 flex items-center pl-4 pointer-events-none"
                    style={{ 
                      bottom: `${laneBottom}px`,
                      height: '1px'
                    }}
                  >
                    <span className="text-[10px] font-mono text-slate-400 font-black tracking-wider opacity-70">
                      LANE_{processId}
                    </span>
                  </div>
                );
              })}

              {/* Bottom Ground Line */}
              <div 
                className="absolute left-0 right-0 border-b-2 border-slate-400"
                style={{ bottom: '15px', height: '1px' }}
              />

              {/* Spikes Obstacles - removed */}

              {/* Execution Block Platforms */}
              {gdDisplayTimeline.map((item, idx) => {
                const i = uniqueProcessIds.indexOf(item.processId);
                const laneBottom = (uniqueProcessIds.length - 1 - i) * 64 + 30;
                const leftPx = (item.startTime / maxTime) * levelWidth;
                const widthPx = ((item.renderedEndTime - item.startTime) / maxTime) * levelWidth;

                return (
                  <div
                    key={`block-${idx}`}
                    className="absolute rounded border-t-[3px] flex flex-col justify-between overflow-hidden shadow-sm select-none transition-all duration-75"
                    style={{
                      left: `${leftPx}px`,
                      width: `${widthPx}px`,
                      bottom: `${laneBottom}px`,
                      height: '24px',
                      backgroundColor: `${item.color}cc`,
                      borderColor: item.color,
                      boxShadow: `0 2px 8px ${item.color}44`,
                    }}
                  >
                    {/* Retro bevel grid inside GD style blocks */}
                    <div className="w-full h-full opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,0.3)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.3)_75%,transparent_75%,transparent)] bg-[size:10px_10px]" />
                    {/* Process tag inside the block */}
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white text-[10px] drop-shadow font-sans tracking-wide">
                      {item.processId}
                    </div>
                  </div>
                );
              })}

              {/* Fading Neon Trail */}
              {trail.map((point) => {
                const trailActiveInterval = timeline.find(t => (point.x / levelWidth) * maxTime >= t.startTime && (point.x / levelWidth) * maxTime < t.endTime);
                const trailColor = trailActiveInterval?.color || '#3B82F6';
                return (
                  <div
                    key={point.id}
                    className="absolute w-7 h-7 rounded pointer-events-none blur-[1px] transform -translate-x-1/2"
                    style={{
                      left: `${point.x}px`,
                      bottom: `${point.y}px`,
                      backgroundColor: `${trailColor}33`,
                      border: `1px solid ${trailColor}66`,
                      opacity: 0.4,
                      transform: 'scale(0.8) translate(-50%, 0)',
                    }}
                  />
                );
              })}

              {/* Cube Character (Active Process Core Head) */}
              <div
                className="absolute transform -translate-x-1/2"
                style={{
                  left: `${(currentTime / maxTime) * levelWidth}px`,
                  bottom: `${cubeBottom}px`,
                  transition: 'bottom 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.08s linear',
                }}
              >
                {/* Floating Process Time Label */}
                {activeInterval ? (
                  <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] font-black font-mono tracking-wider transition-all duration-300 px-1.5 py-0.5 rounded border"
                    style={{
                      color: activeInterval.color,
                      backgroundColor: `${activeInterval.color}18`,
                      borderColor: `${activeInterval.color}66`,
                      boxShadow: `0 1px 6px ${activeInterval.color}33`
                    }}
                  >
                    {activeInterval.processId} ({activeInterval.startTime}-{activeInterval.endTime}s)
                  </div>
                ) : (
                  <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] font-black font-mono tracking-wider text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300"
                  >
                    IDLE
                  </div>
                )}

                <div 
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`
                  }}
                >
                  <GeometryDashCube 
                    color={activeInterval?.color || '#94a3b8'}
                    faceType={activeInterval ? getFaceTypeForProcess(activeInterval.processId) : 'standard'}
                    isJumping={isJumping}
                    size={28}
                  />
                </div>
              </div>

              {/* Final Gate (Portal) */}
              <div 
                className="absolute w-8 border-2 border-green-400 bg-green-50 shadow-[0_0_12px_rgba(34,197,94,0.20)] flex flex-col justify-around items-center"
                style={{
                  left: `${levelWidth - 35}px`,
                  top: '15px',
                  bottom: '15px',
                  borderRadius: '6px'
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>

          {/* HUD Info bar */}
          <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-wide">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              Karakter kubus melompat dan berputar saat terjadi perpindahan proses (Context Switch).
            </span>
            <span className="hidden sm:inline">STYLE: CLEAN LIGHT • FPS: 60 (HW ACCEL)</span>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 transition-all">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Total Time</p>
          <p className="text-2xl font-black text-slate-900">
            {timeline.length > 0 ? Math.max(...timeline.map(t => t.endTime)) : 0}
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 transition-all">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Processes</p>
          <p className="text-2xl font-black text-slate-900">
            {new Set(displayTimeline.map(t => t.processId)).size}
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 transition-all">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Tasks</p>
          <p className="text-2xl font-black text-slate-900">
            {displayTimeline.length}
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 transition-all">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Progress</p>
          <p className="text-2xl font-black text-slate-900">
            {isPlaying
              ? `${finishTime > 0 ? Math.min(100, (currentTime / finishTime) * 100).toFixed(0) : 0}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Storyteller AI Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800">AI Storyteller</h3>
          {isLoadingStory && (
            <span className="ml-auto text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Menyusun cerita...
            </span>
          )}
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[80px] flex items-center">
          {isLoadingStory ? (
            <p className="text-slate-500 text-sm italic">AI sedang memahami alur proses...</p>
          ) : currentStorySnippet ? (
            <div className="flex gap-4 items-start w-full">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: activeInterval?.color || '#10b981' }}>
                {currentStorySnippet.processId}
              </div>
              <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentStorySnippet.story}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              {currentTime >= finishTime ? "Semua proses telah selesai dieksekusi." : "Menunggu proses dieksekusi..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

