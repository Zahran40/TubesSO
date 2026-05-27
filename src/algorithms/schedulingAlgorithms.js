/**
 * FCFS (First Come, First Served) Algorithm
 * Proses yang datang pertama akan dieksekusi terlebih dahulu
 */
export const FCFS = (processes) => {
  if (!processes || processes.length === 0) {
    return { name: 'FCFS', processStats: [], timeline: [], averageWaitingTime: 0, averageResponseTime: 0, averageTurnaroundTime: 0, throughput: 0 };
  }
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline = [];
  let currentTime = 0;

  const processStats = sorted.map(process => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const endTime = startTime + process.burstTime;
    const waitingTime = startTime - process.arrivalTime;
    const responseTime = startTime - process.arrivalTime;

    timeline.push({
      processId: process.id,
      startTime,
      endTime,
      color: process.color,
    });

    currentTime = endTime;

    return {
      ...process,
      startTime,
      endTime,
      waitingTime,
      responseTime,
      turnaroundTime: endTime - process.arrivalTime,
    };
  });

  return {
    name: 'FCFS',
    processStats,
    timeline,
    averageWaitingTime: processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length,
    averageResponseTime: processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length,
    averageTurnaroundTime: processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length,
    throughput: processStats.length / (currentTime || 1),
  };
};

/**
 * SJF (Shortest Job First) - Non-Preemptive
 * Proses dengan durasi eksekusi paling singkat diprioritaskan
 */
export const SJF = (processes) => {
  if (!processes || processes.length === 0) {
    return { name: 'SJF', processStats: [], timeline: [], averageWaitingTime: 0, averageResponseTime: 0, averageTurnaroundTime: 0, throughput: 0 };
  }
  const timeline = [];
  let currentTime = 0;
  const remaining = [...processes];
  const processStats = [];

  while (remaining.length > 0) {
    // Filter proses yang sudah tiba
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      // Jika tidak ada proses yang tersedia, lompat ke waktu kedatangan berikutnya
      const nextArrival = remaining.reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);
      currentTime = nextArrival;
    } else {
      // Pilih proses dengan burst time terpendek
      const selected = available.reduce((min, p) => 
        p.burstTime < min.burstTime ? p : min
      );

      const startTime = currentTime;
      const endTime = startTime + selected.burstTime;
      const waitingTime = startTime - selected.arrivalTime;
      const responseTime = startTime - selected.arrivalTime;

      timeline.push({
        processId: selected.id,
        startTime,
        endTime,
        color: selected.color,
      });

      processStats.push({
        ...selected,
        startTime,
        endTime,
        waitingTime,
        responseTime,
        turnaroundTime: endTime - selected.arrivalTime,
      });

      currentTime = endTime;
      remaining.splice(remaining.indexOf(selected), 1);
    }
  }

  return {
    name: 'SJF',
    processStats,
    timeline,
    averageWaitingTime: processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length,
    averageResponseTime: processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length,
    averageTurnaroundTime: processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length,
    throughput: processStats.length / (currentTime || 1),
  };
};

/**
 * Round Robin (RR) Algorithm
 * Setiap proses mendapat jatah waktu (quantum) untuk dieksekusi secara bergilir
 */
export const RoundRobin = (processes, quantum = 4) => {
  const validQuantum = (!quantum || isNaN(quantum) || quantum <= 0) ? 4 : quantum;
  if (!processes || processes.length === 0) {
    return { name: `Round Robin (Q=${validQuantum})`, processStats: [], timeline: [], averageWaitingTime: 0, averageResponseTime: 0, averageTurnaroundTime: 0, throughput: 0 };
  }
  const timeline = [];
  let currentTime = 0;
  const queue = [];
  const processStats = {};
  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Inisialisasi stat untuk setiap proses
  processes.forEach(p => {
    processStats[p.id] = {
      ...p,
      remainingTime: p.burstTime,
      startTime: null,
      endTime: null,
      waitingTime: 0,
      responseTime: null,
      firstExecution: true,
    };
  });

  // Tambahkan proses yang tiba di awal ke queue
  const initialArrived = remaining.filter(p => p.arrivalTime <= currentTime);
  initialArrived.forEach(p => {
    queue.push(p);
    const index = remaining.indexOf(p);
    if (index > -1) remaining.splice(index, 1);
  });

  while (queue.length > 0 || remaining.length > 0) {
    if (queue.length === 0 && remaining.length > 0) {
      // Jika queue kosong, lompat ke waktu kedatangan berikutnya yang paling awal
      const nextArrival = remaining.reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);
      currentTime = nextArrival;

      // Masukkan semua proses yang tiba di waktu tersebut ke queue
      const arrived = remaining.filter(p => p.arrivalTime <= currentTime);
      arrived.forEach(p => {
        queue.push(p);
        const index = remaining.indexOf(p);
        if (index > -1) remaining.splice(index, 1);
      });
    }

    if (queue.length === 0) break;

    const process = queue.shift();
    const stats = processStats[process.id];

    if (stats.firstExecution) {
      stats.startTime = currentTime;
      stats.responseTime = currentTime - process.arrivalTime;
      stats.firstExecution = false;
    }

    const executionTime = Math.min(validQuantum, stats.remainingTime);
    const startTime = currentTime;
    const endTime = startTime + executionTime;

    timeline.push({
      processId: process.id,
      startTime,
      endTime,
      color: process.color,
    });

    stats.remainingTime -= executionTime;
    currentTime = endTime;

    // 1. Masukkan proses baru yang sudah tiba selama masa eksekusi ini ke queue
    const arrived = remaining.filter(p => p.arrivalTime <= currentTime);
    arrived.forEach(p => {
      queue.push(p);
      const index = remaining.indexOf(p);
      if (index > -1) remaining.splice(index, 1);
    });

    // 2. Baru kemudian masukkan kembali proses yang belum selesai (preempted) ke queue
    if (stats.remainingTime > 0) {
      queue.push(process);
    } else {
      stats.endTime = endTime;
      stats.turnaroundTime = endTime - process.arrivalTime;
      stats.waitingTime = stats.turnaroundTime - process.burstTime;
    }
  }

  const completedStats = Object.values(processStats);

  return {
    name: `Round Robin (Q=${validQuantum})`,
    processStats: completedStats,
    timeline,
    averageWaitingTime: completedStats.reduce((sum, p) => sum + p.waitingTime, 0) / completedStats.length,
    averageResponseTime: completedStats.reduce((sum, p) => sum + p.responseTime, 0) / completedStats.length,
    averageTurnaroundTime: completedStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / completedStats.length,
    throughput: completedStats.length / (currentTime || 1),
  };
};

/**
 * Priority Scheduling - Non-Preemptive
 * Proses dengan prioritas tertinggi (nilai terendah) akan dieksekusi terlebih dahulu
 */
export const PriorityScheduling = (processes) => {
  if (!processes || processes.length === 0) {
    return { name: 'Priority Scheduling', processStats: [], timeline: [], averageWaitingTime: 0, averageResponseTime: 0, averageTurnaroundTime: 0, throughput: 0 };
  }
  const timeline = [];
  let currentTime = 0;
  const remaining = [...processes];
  const processStats = [];

  while (remaining.length > 0) {
    // Filter proses yang sudah tiba
    const available = remaining.filter(p => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // Jika tidak ada proses yang tersedia, lompat ke waktu kedatangan berikutnya
      const nextArrival = remaining.reduce((min, p) => Math.min(min, p.arrivalTime), Infinity);
      currentTime = nextArrival;
    } else {
      // Pilih proses dengan prioritas tertinggi (nilai terendah)
      // Tie-breaking: jika prioritas sama, pilih arrival time yang lebih awal
      const selected = available.reduce((min, p) => {
        const pPriority = p.priority !== undefined && !isNaN(p.priority) ? p.priority : Infinity;
        const minPriority = min.priority !== undefined && !isNaN(min.priority) ? min.priority : Infinity;
        
        if (pPriority < minPriority) return p;
        if (pPriority === minPriority) {
          return p.arrivalTime < min.arrivalTime ? p : min;
        }
        return min;
      });

      const startTime = currentTime;
      const endTime = startTime + selected.burstTime;
      const waitingTime = startTime - selected.arrivalTime;
      const responseTime = startTime - selected.arrivalTime;

      timeline.push({
        processId: selected.id,
        startTime,
        endTime,
        color: selected.color,
      });

      processStats.push({
        ...selected,
        startTime,
        endTime,
        waitingTime,
        responseTime,
        turnaroundTime: endTime - selected.arrivalTime,
      });

      currentTime = endTime;
      remaining.splice(remaining.indexOf(selected), 1);
    }
  }

  return {
    name: 'Priority Scheduling',
    processStats,
    timeline,
    averageWaitingTime: processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length,
    averageResponseTime: processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length,
    averageTurnaroundTime: processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length,
    throughput: processStats.length / (currentTime || 1),
  };
};

/**
 * Jalankan semua algoritma dan return hasil perbandingan
 */
export const runAllAlgorithms = (processes, quantum = 4) => {
  return {
    fcfs: FCFS(processes),
    sjf: SJF(processes),
    roundRobin: RoundRobin(processes, quantum),
    priority: PriorityScheduling(processes),
  };
};
