import React, { useState, useEffect } from 'react';
import { Delete, Lock, CheckCircle2, AlertCircle, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
import { playKeypadClick, playSuccessSound, playErrorBeep } from '../utils/audio';

interface MpinScreenProps {
  userName?: string;
  onSuccess: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOpenDownloadModal?: () => void;
}

export const MpinScreen: React.FC<MpinScreenProps> = ({
  onSuccess,
  isFullscreen,
  onToggleFullscreen,
  onOpenDownloadModal,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // MPIN required
  const CORRECT_MPIN = '4444';

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4 && !isSuccess) {
      playKeypadClick();
      setError('');
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    playKeypadClick();
    setError('');
    setPin((prev) => prev.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === CORRECT_MPIN) {
      setIsSuccess(true);
      playSuccessSound();
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      playErrorBeep();
      setIsShaking(true);
      setError('Incorrect MPIN. Please try again.');
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 500);
    }
  };

  // Keyboard number typing support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter' && pin.length === 4) {
        verifyPin(pin);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8C1D24] via-[#6B141A] to-[#400B0E] text-white flex flex-col justify-between items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle ICICI Curve geometric background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F37021]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#B02A30]/20 blur-3xl pointer-events-none" />

      {/* Controls Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {onOpenDownloadModal && (
          <button
            onClick={onOpenDownloadModal}
            title="Download / Install App to Phone"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F37021] hover:bg-orange-600 text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
          >
            <span>📲 Download App</span>
          </button>
        )}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-orange-200 border border-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
          </button>
        )}
      </div>

      {/* Top Header: ICICI Bank / iMobile Pay Emblem Only */}
      <div className="relative z-10 pt-6 sm:pt-10 flex flex-col items-center text-center">
        {/* Iconic ICICI Bank Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F37021] to-[#B02A30] text-white font-black text-2xl flex items-center justify-center shadow-2xl border-2 border-white/30 mb-3 relative group">
          <span className="font-serif italic text-3xl font-bold tracking-tighter">i</span>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F37021] border border-white flex items-center justify-center text-[9px] font-sans font-bold">
            ✓
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            ICICI Bank
          </h1>
          <span className="text-[11px] font-bold bg-[#F37021] text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
            iMobile Pay
          </span>
        </div>
        <p className="text-xs text-orange-200/80 font-medium tracking-wider uppercase mt-1">
          Secure Mobile Banking Portal
        </p>
      </div>

      {/* Middle Section: Clean MPIN dots without exposing holder or hints */}
      <div className="relative z-10 flex flex-col items-center my-auto py-6 w-full max-w-xs">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-orange-300" />
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
            Enter 4-Digit MPIN
          </h2>
        </div>

        {/* 4 PIN Dots */}
        <div className={`flex items-center gap-6 my-2 ${isShaking ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 ${
                  isSuccess
                    ? 'bg-emerald-400 scale-125 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                    : isFilled
                    ? 'bg-[#F37021] scale-110 shadow-[0_0_12px_rgba(243,112,33,0.7)]'
                    : 'border-2 border-white/40 bg-white/10'
                }`}
              />
            );
          })}
        </div>

        {/* Status / Error Message */}
        <div className="min-h-[32px] mt-3 flex items-center justify-center">
          {error ? (
            <div className="flex items-center gap-1.5 text-xs text-red-200 bg-red-950/70 border border-red-500/50 px-3 py-1.5 rounded-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifying & Opening iMobile...</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Clean Numeric Keypad */}
      <div className="relative z-10 max-w-xs w-full pb-6 sm:pb-8">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-md hover:border-orange-400/40 backdrop-blur-sm"
            >
              {digit}
            </button>
          ))}

          {/* Empty spacer on left */}
          <div className="h-14 flex items-center justify-center text-white/20 text-xs">
            •
          </div>

          {/* 0 */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-md hover:border-orange-400/40 backdrop-blur-sm"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            title="Delete"
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-white/80 hover:text-white shadow-md hover:border-orange-400/40 backdrop-blur-sm"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Security badge at bottom */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-orange-200/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ICICI Bank • 256-bit Encrypted Mobile Banking</span>
        </div>
      </div>
    </div>
  );
};
