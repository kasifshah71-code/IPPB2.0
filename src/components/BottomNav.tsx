import React from 'react';
import { TabType } from '../types/banking';
import { Home, CreditCard, Landmark, TrendingUp, Receipt, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Accounts', icon: Home },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'loans', label: 'Loans', icon: Landmark },
    { id: 'deposits', label: 'Deposits', icon: TrendingUp },
    { id: 'bills', label: 'Bill Pay', icon: Receipt },
    { id: 'services', label: 'Services', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 sm:px-6 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#8C1D24] font-black scale-105'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-red-50 text-[#8C1D24]' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
