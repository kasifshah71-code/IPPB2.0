import React from 'react';
import { Send, QrCode, TrendingUp, Receipt, CreditCard, Landmark, ShieldAlert, ArrowRight } from 'lucide-react';
import { TabType } from '../types/banking';

interface QuickActionsProps {
  onOpenTransfer: (prefillType?: 'bank' | 'upi' | 'ippb') => void;
  onOpenReceiveQR: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenTransfer,
  onOpenReceiveQR,
  onNavigateTab,
}) => {
  const actions = [
    {
      title: 'Send Money',
      subtitle: 'RTGS / IMPS / NEFT',
      icon: Send,
      iconBg: 'bg-red-50 text-[#8C1D24]',
      badge: 'Blocked',
      badgeColor: 'bg-red-100 text-red-800',
      onClick: () => onOpenTransfer('bank'),
    },
    {
      title: 'Credit Cards',
      subtitle: 'Emeralde & RuPay',
      icon: CreditCard,
      iconBg: 'bg-stone-900 text-amber-300',
      badge: '₹15L Limit',
      badgeColor: 'bg-amber-100 text-amber-900',
      onClick: () => onNavigateTab('cards'),
    },
    {
      title: 'Loans & EMI',
      subtitle: 'Pre-Approved ₹25L',
      icon: Landmark,
      iconBg: 'bg-amber-50 text-amber-800',
      badge: 'Instant Sanction',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      onClick: () => onNavigateTab('loans'),
    },
    {
      title: 'FD & Wealth',
      subtitle: '₹93L Portfolio',
      icon: TrendingUp,
      iconBg: 'bg-blue-50 text-blue-700',
      badge: '7.25% p.a.',
      badgeColor: 'bg-blue-100 text-blue-800',
      onClick: () => onNavigateTab('deposits'),
    },
    {
      title: 'Bill Pay & FASTag',
      subtitle: 'Electricity / DTH',
      icon: Receipt,
      iconBg: 'bg-purple-50 text-purple-700',
      badge: 'BBPS',
      badgeColor: 'bg-purple-100 text-purple-800',
      onClick: () => onNavigateTab('bills'),
    },
    {
      title: 'Case Dossier',
      subtitle: 'Debit Freeze Status',
      icon: ShieldAlert,
      iconBg: 'bg-red-100 text-red-800',
      badge: 'Sec 131',
      badgeColor: 'bg-red-200 text-red-900',
      onClick: () => onNavigateTab('services'),
    },
    {
      title: 'Scan & Pay QR',
      subtitle: 'UPI QR Terminal',
      icon: QrCode,
      iconBg: 'bg-emerald-50 text-emerald-700',
      badge: 'UPI 2.0',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      onClick: onOpenReceiveQR,
    },
  ];

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
          <span>iMobile Privilege Services</span>
          <span className="text-[10px] bg-orange-100 text-[#F37021] px-2 py-0.5 rounded-full font-bold uppercase">
            All Options
          </span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Flagship Banking Suite</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.onClick}
              className="group relative flex flex-col items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all active:scale-95 text-center"
            >
              <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${act.badgeColor}`}>
                {act.badge}
              </span>

              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 mt-1 transition-transform group-hover:scale-110 shadow-xs ${act.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#8C1D24] transition-colors block">
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                  {act.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
