import React, { useState, useEffect } from 'react';
import { Delete, Lock, Building2, CheckCircle2, AlertCircle, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
import { playKeypadClick, playSuccessSound, playErrorBeep } from '../utils/audio';

interface MpinScreenProps {
  userName?: string;
  onSuccess: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MpinScreen: React.FC<MpinScreenProps> = ({
  onSuccess,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // MPIN required: 4444
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
    <div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#750000] to-[#450000] text-white flex flex-col justify-between items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Decorative Postal Stamp Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Fullscreen Toggle Top Right */}
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
        </button>
      )}

      {/* Top Header: IPPB Bank Brand Only */}
      <div className="relative z-10 pt-6 sm:pt-10 flex flex-col items-center text-center">
        {/* IPPB Emblem Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#8B0000] font-black text-xl flex items-center justify-center shadow-xl border-2 border-white/30 mb-3">
          IPPB
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          India Post Payments Bank
        </h1>
        <p className="text-xs text-red-200/90 font-medium tracking-wider uppercase mt-0.5">
          इण्डिया पोस्ट पेमेंट्स बैंक
        </p>
      </div>

      {/* Middle Section: Clean MPIN dots */}
      <div className="relative z-10 flex flex-col items-center my-auto py-6 w-full max-w-xs">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-amber-300" />
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
                    ? 'bg-amber-400 scale-110 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
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
              <span>Verifying...</span>
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
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-md hover:border-white/30 backdrop-blur-sm"
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
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-md hover:border-white/30 backdrop-blur-sm"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            title="Delete"
            className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-150 border border-white/10 flex items-center justify-center text-white/80 hover:text-white shadow-md hover:border-white/30 backdrop-blur-sm"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Security badge at bottom */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-200/70">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>India Post Payments Bank • Secured by NPCI</span>
        </div>
      </div>
    </div>
  );
};
