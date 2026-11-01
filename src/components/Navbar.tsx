import React from 'react';
import { LogOut, Bell, FileText, QrCode, Maximize2, Minimize2, ShieldCheck, Crown, Home, CreditCard, Landmark, TrendingUp, Receipt } from 'lucide-react';
import { UserAccount, TabType } from '../types/banking';

interface NavbarProps {
  user: UserAccount;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLogout: () => void;
  onOpenStatement: () => void;
  onOpenReceiveQR: () => void;
  onOpenDownloadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onSelectTab,
  isFullscreen,
  onToggleFullscreen,
  onLogout,
  onOpenStatement,
  onOpenReceiveQR,
  onOpenDownloadModal,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Accounts', icon: Home },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'loans', label: 'Loans & EMI', icon: Landmark },
    { id: 'deposits', label: 'Deposits', icon: TrendingUp },
    { id: 'bills', label: 'Bill Pay', icon: Receipt },
    { id: 'services', label: 'Services', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#8C1D24] border-b border-[#70141A] text-white shadow-lg">
      {/* Top micro strip */}
      <div className="bg-[#651016] px-4 py-1 flex items-center justify-between text-[11px] text-orange-200/90">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#F37021] flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-300" />
            ICICI Bank Privilege Banking
          </span>
          <span className="text-white/30">|</span>
          <span className="hidden sm:inline">Khayaal Aapka</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Priority Desk: 1800 1080</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            256-Bit SSL Live
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* ICICI 'i' Emblem */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F37021] to-[#B02A30] text-white flex items-center justify-center font-serif italic text-2xl font-black shadow-md border border-white/20">
            i
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-xl tracking-tight leading-tight">
                ICICI Bank
              </span>
              <span className="text-[10px] bg-[#F37021] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">
                iMobile
              </span>
            </div>
            <p className="text-[11px] text-orange-200/90 font-medium leading-none">
              Hum Hai Na, Khayaal Aapka
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Download App button */}
          {onOpenDownloadModal && (
            <button
              onClick={onOpenDownloadModal}
              title="Download & Install Application"
              className="flex items-center gap-1.5 bg-[#F37021] hover:bg-orange-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl transition-transform active:scale-95 shadow-md"
            >
              <span>📲</span>
              <span className="hidden sm:inline">Download App</span>
            </button>
          )}

          {/* Full Screen Toggle Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-orange-200 hover:text-white transition-colors text-xs font-medium border border-white/15"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-orange-300" />
                <span className="hidden lg:inline text-[11px]">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-orange-300" />
                <span className="hidden lg:inline text-[11px]">Full Screen</span>
              </>
            )}
          </button>

          {/* Statement shortcut */}
          <button
            onClick={onOpenStatement}
            title="Generate Statement"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium border border-white/15"
          >
            <FileText className="w-3.5 h-3.5 text-orange-300" />
            <span>e-Statement</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              title="Notifications"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
            >
              <Bell className="w-4 h-4 text-orange-200" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F37021]" />
            </button>
          </div>

          {/* Lock / Logout */}
          <button
            onClick={onLogout}
            title="Lock & Logout (Requires MPIN to re-enter)"
            className="flex items-center gap-1.5 bg-red-950/70 hover:bg-red-950 text-red-200 hover:text-white border border-red-500/40 text-xs px-2.5 py-1.5 rounded-xl transition-colors font-medium ml-1"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar for Tabs */}
      <div className="bg-[#78171E] border-t border-[#651016]/60 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-5xl mx-auto flex items-center gap-1 sm:gap-2 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#8C1D24] shadow-sm'
                    : 'text-orange-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
