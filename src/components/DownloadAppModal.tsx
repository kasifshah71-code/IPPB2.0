import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, Apple, QrCode, Copy, Check, ExternalLink, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeOsTab, setActiveOsTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Get current app URL
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-qgr3qs7txd27feuxpwqmas-714913094799.asia-east1.run.app';

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install directly, tap the browser menu (⋮ on Android or Share icon on iPhone) and select "Add to Home Screen" / "Install App".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 my-auto text-slate-900 animate-in fade-in">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F37021] to-[#8C1D24] text-white flex items-center justify-center font-black shadow-md border border-white/20">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Download & Install App
              </h3>
              <p className="text-xs text-slate-500">
                Install ICICI Bank iMobile Pay directly on your Phone or PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Install or Direct Action */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 block text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F37021]" />
              <span>Progressive Web App (PWA)</span>
            </span>
            <p className="text-slate-600 mt-0.5">
              Works like a native application with home screen icon, instant launch, and offline caching.
            </p>
          </div>
          <button
            onClick={handleNativeInstall}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-black whitespace-nowrap shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalled ? 'App Installed' : '1-Click Install'}</span>
          </button>
        </div>

        {/* App Link & QR Code */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">App URL Link</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
              Live & Secure
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 bg-white px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 text-slate-700 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions based on OS */}
        <div className="space-y-3">
          <div className="flex border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveOsTab('android')}
              className={`flex-1 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeOsTab === 'android'
                  ? 'border-[#8C1D24] text-[#8C1D24]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android (Chrome)</span>
            </button>
            <button
              onClick={() => setActiveOsTab('ios')}
              className={`flex-1 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeOsTab === 'ios'
                  ? 'border-[#8C1D24] text-[#8C1D24]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone (Safari)</span>
            </button>
            <button
              onClick={() => setActiveOsTab('desktop')}
              className={`flex-1 py-2 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeOsTab === 'desktop'
                  ? 'border-[#8C1D24] text-[#8C1D24]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Computer / PC</span>
            </button>
          </div>

          {/* Android Guide */}
          {activeOsTab === 'android' && (
            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Apne phone me <strong>Google Chrome</strong> browser me ye link open karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Top right corner me <strong>3 Dots (⋮)</strong> par click karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Menu me se <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> (होम स्क्रीन पर जोड़ें) select karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  <strong>Install</strong> par tap karein. Application aapke phone ki home screen par app icon ke sath download ho jayegi.
                </p>
              </div>
            </div>
          )}

          {/* iOS Guide */}
          {activeOsTab === 'ios' && (
            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  iPhone me <strong>Safari Browser</strong> me ye link open karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Bottom bar me <strong>Share button</strong> (Square box with up arrow ⎋) par click karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  List me neeche scroll karke <strong>"Add to Home Screen"</strong> (होम स्क्रीन में जोड़ें) par tap karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  4
                </span>
                <p>
                  Top right me <strong>"Add"</strong> tap karein. App iPhone par full screen app bankar install ho jayega.
                </p>
              </div>
            </div>
          )}

          {/* Desktop Guide */}
          {activeOsTab === 'desktop' && (
            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Google Chrome ya Microsoft Edge browser me address bar dekhein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Address bar ke daayein taraf <strong>Install icon (कंप्यूटर स्क्रीन + डाउन एरो)</strong> dikhega.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8C1D24] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  <strong>Install</strong> par click karein. Desktop par alag se window me bina browser URL bar ke open hoga.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
        >
          Got It / Theek Hai
        </button>
      </div>
    </div>
  );
};
