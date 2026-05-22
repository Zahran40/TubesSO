import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardStep from './components/steps/DashboardStep';
import SimulatorStep from './components/steps/SimulatorStep';
import ResultsStep from './components/steps/ResultsStep';
import { runAllAlgorithms } from './algorithms/schedulingAlgorithms';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [currentStep, setCurrentStep] = useState('dashboard'); // 'dashboard', 'simulator', 'results'
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(4);
  const [simulationResults, setSimulationResults] = useState(null);

  const handleRunSimulation = async () => {
    if (processes.length === 0) {
      toast.error('Tambahkan minimal 1 proses terlebih dahulu');
      return;
    }
    const results = runAllAlgorithms(processes, quantum);
    setSimulationResults(results);
    setCurrentStep('results');
    
    try {
      // Save to local history API
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processes,
          selectedAlgorithm,
          quantum,
          results
        })
      });
      toast.success('Simulasi berhasil dijalankan dan disimpan');
    } catch (error) {
      console.error('Failed to save history:', error);
      toast.success('Simulasi berhasil dijalankan (Gagal menyimpan riwayat)');
    }
  };

  const handleLoadHistory = (historyEntry) => {
    setProcesses(historyEntry.processes);
    setSelectedAlgorithm(historyEntry.selectedAlgorithm);
    setQuantum(historyEntry.quantum);
    
    // Recalculate results so they use the updated bug-free algorithms!
    const recalculatedResults = runAllAlgorithms(historyEntry.processes, historyEntry.quantum);
    setSimulationResults(recalculatedResults);
    
    setCurrentStep('results');
    toast.info(`Memuat riwayat simulasi ${historyEntry.id}`);
  };

  const handleReset = () => {
    setCurrentStep('simulator');
    setProcesses([]);
    setSimulationResults(null);
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen bg-white text-slate-900">
        <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} />
        
        <div className="flex-1 overflow-auto bg-slate-50 flex">
          {currentStep === 'dashboard' && (
            <DashboardStep 
              setStep={setCurrentStep}
              onLoadHistory={handleLoadHistory}
            />
          )}
          
          {currentStep === 'simulator' && (
            <SimulatorStep
              processes={processes}
              setProcesses={setProcesses}
              selectedAlgorithm={selectedAlgorithm}
              setSelectedAlgorithm={setSelectedAlgorithm}
              quantum={quantum}
              setQuantum={setQuantum}
              onRun={handleRunSimulation}
            />
          )}
          
          {currentStep === 'results' && (
            <ResultsStep
              simulationResults={simulationResults}
              selectedAlgorithm={selectedAlgorithm}
              setSelectedAlgorithm={setSelectedAlgorithm}
              onBack={() => setCurrentStep('simulator')}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  );
}
