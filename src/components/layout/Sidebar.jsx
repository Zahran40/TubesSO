import { LayoutDashboard, Play, BarChart2 } from 'lucide-react';

export default function Sidebar({ currentStep, setCurrentStep }) {
  const steps = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Simulator', icon: Play },
    { id: 'results', label: 'Hasil', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-10">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="CPUFlow Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CPUFlow</h1>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Simulator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep && setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
