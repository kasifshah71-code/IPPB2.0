import React, { useState } from 'react';
import { Send, Smartphone, QrCode, Home, Receipt, CreditCard, Building, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface QuickActionsProps {
  onOpenTransfer: (prefillType?: 'bank' | 'upi' | 'ippb') => void;
  onOpenReceiveQR: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenTransfer,
  onOpenReceiveQR,
}) => {
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const actions = [
    {
      title: 'Send to Bank',
      subtitle: 'A/C + IFSC',
      icon: Building,
      color: 'bg-red-50 text-red-700 border-red-200',
      iconBg: 'bg-red-100 text-[#8B0000]',
      onClick: () => onOpenTransfer('bank'),
    },
    {
      title: 'Send via UPI',
      subtitle: 'To Any UPI ID',
      icon: Send,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      onClick: () => onOpenTransfer('upi'),
    },
    {
      title: 'Scan & Pay',
      subtitle: 'Any Bharat QR',
      icon: QrCode,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      onClick: onOpenReceiveQR,
    },
    {
      title: 'Doorstep Banking',
      subtitle: 'Postman at Home',
      icon: Home,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      onClick: () => showToast('Doorstep Banking agent dispatched to registered address!'),
    },
    {
      title: 'Bill Pay & DTH',
      subtitle: 'BBPS Enabled',
      icon: Receipt,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-700',
      onClick: () => showToast('BBPS Bill Payment portal active for mobile & utility bills.'),
    },
    {
      title: 'Virtual RuPay Card',
      subtitle: 'Manage Limits',
      icon: CreditCard,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      iconBg: 'bg-slate-200 text-slate-700',
      onClick: () => showToast('Virtual RuPay Platinum Debit Card active ending with 8231.'),
    },
  ];

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
          <span>Banking Services</span>
          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-semibold uppercase">
            IPPB 2.0
          </span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Instant & Zero Fee</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.onClick}
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-red-300 hover:shadow-md transition-all active:scale-95 text-center"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm ${act.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#8B0000] transition-colors">
                {act.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                {act.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating alert notification */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{activeToast}</span>
          <button onClick={() => setActiveToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
