import React from 'react';
import { LogOut, Bell, FileText, QrCode, Maximize2, Minimize2 } from 'lucide-react';
import { UserAccount } from '../types/banking';

interface NavbarProps {
  user: UserAccount;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLogout: () => void;
  onOpenStatement: () => void;
  onOpenOriginalImage: () => void;
  onOpenReceiveQR: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isFullscreen,
  onToggleFullscreen,
  onLogout,
  onOpenStatement,
  onOpenOriginalImage,
  onOpenReceiveQR,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#8B0000] border-b border-[#6f0000] text-white shadow-md">
      {/* Top micro strip */}
      <div className="bg-[#660000] px-4 py-1 flex items-center justify-between text-[11px] text-red-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">भारत सरकार • Govt. of India</span>
          <span>|</span>
          <span>डाक विभाग • Department of Posts</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Toll Free: 155299</span>
          <span>•</span>
          <span className="text-emerald-300 font-medium">● Server Live</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* IPPB Emblem Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-[#8B0000] flex items-center justify-center font-extrabold text-sm shadow-md border-2 border-white/20">
            IPPB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight leading-tight">
                India Post Payments Bank
              </span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-medium leading-none">
              A Govt. of India Undertaking
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Statement Image Button */}
          <button
            onClick={onOpenOriginalImage}
            title="View Original Uploaded Statement"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Attached Statement</span>
          </button>

          {/* QR Code Receive */}
          <button
            onClick={onOpenReceiveQR}
            title="My QR Code & UPI ID"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white transition-colors text-xs font-medium"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-amber-300" />
                <span className="hidden lg:inline text-[11px]">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-amber-300" />
                <span className="hidden lg:inline text-[11px]">Full Screen</span>
              </>
            )}
          </button>

          {/* Statement shortcut */}
          <button
            onClick={onOpenStatement}
            title="Generate Statement"
            className="hidden sm:flex items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium"
          >
            Passbook
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              title="Notifications"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
            </button>
          </div>

          {/* Lock / Logout */}
          <button
            onClick={onLogout}
            title="Lock & Logout (Requires MPIN to re-enter)"
            className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-950 text-red-200 hover:text-white border border-red-500/30 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-medium ml-1"
          >
            <LogOut className="w-3.5 h-3.5 text-red-300" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
