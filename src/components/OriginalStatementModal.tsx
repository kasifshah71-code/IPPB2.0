import React from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface OriginalStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalStatementModal: React.FC<OriginalStatementModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#8B0000] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base">
              Original Attached Statement Reference
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">100% Data Fidelity Match</p>
              <p className="text-emerald-700 mt-0.5 leading-relaxed">
                All transaction details, beneficiary names (Durga Gopal Dhakare, Susmita Mondal, Pawan Prajapati, Suresh Kumar Bhawar Lal, Santoshi Chouriya), UPI transaction IDs, and amounts from this statement have been integrated into this IPPB portal for <strong>Lalit Sherke</strong>.
              </p>
            </div>
          </div>

          {/* Render image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 flex items-center justify-center p-2">
            <img
              src="/assets/aistudio/IMG20261021212725_555e3bc1.jpg"
              alt="Uploaded Statement for Lalit Sherke"
              className="max-h-[500px] w-auto object-contain rounded-xl shadow-md"
            />
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
