import React, { useState } from 'react';
import { UtilityBiller } from '../types/banking';
import { SAMPLE_BILLERS } from '../data/bankingExtensions';
import { Zap, Smartphone, Car, Tv, Flame, Wifi, Search, ArrowRight, ShieldAlert, CheckCircle2, Receipt } from 'lucide-react';

interface BillPayViewProps {
  onAttemptDebitAction: () => void;
  userName: string;
}

export const BillPayView: React.FC<BillPayViewProps> = ({ onAttemptDebitAction, userName }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBiller, setActiveBiller] = useState<UtilityBiller | null>(null);
  const [consumerInput, setConsumerInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedBill, setFetchedBill] = useState<UtilityBiller | null>(null);

  const categories = [
    { id: 'all', label: 'All Bills', icon: Receipt },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'mobile', label: 'Mobile & Postpaid', icon: Smartphone },
    { id: 'fastag', label: 'FASTag Recharge', icon: Car },
    { id: 'dth', label: 'DTH & Cable', icon: Tv },
    { id: 'gas', label: 'LPG & Piped Gas', icon: Flame },
    { id: 'broadband', label: 'Broadband Fiber', icon: Wifi },
  ];

  const filteredBillers = selectedCategory === 'all'
    ? SAMPLE_BILLERS
    : SAMPLE_BILLERS.filter(b => b.category === selectedCategory);

  const handleOpenBiller = (biller: UtilityBiller) => {
    setActiveBiller(biller);
    setConsumerInput(biller.sampleConsumerNumber);
    setFetchedBill(null);
  };

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBiller) return;
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setFetchedBill({
        ...activeBiller,
        sampleConsumerNumber: consumerInput || activeBiller.sampleConsumerNumber,
        consumerName: userName,
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#8C1D24]" />
            <span>Bill Payments & Utilities (BBPS)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Bharat BillPay Integrated Utility & FASTag Payments for {userName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-orange-100 text-[#F37021] border border-orange-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            NPCI Bharat BillPay
          </span>
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#8C1D24] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Billers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBillers.map((biller) => (
          <div
            key={biller.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  {biller.category}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Due {biller.dueDate}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{biller.billerName}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Consumer: {biller.sampleConsumerNumber}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Bill Amount</span>
                <span className="font-mono font-black text-slate-900 text-base">
                  ₹{biller.dueAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => handleOpenBiller(biller)}
                className="px-3.5 py-1.5 rounded-xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                <span>Fetch & Pay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Pay & Fetch Modal */}
      {activeBiller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#8C1D24]" />
                <span>{activeBiller.billerName}</span>
              </h3>
              <button
                onClick={() => setActiveBiller(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFetchBill} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Consumer ID / Service Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={consumerInput}
                    onChange={(e) => setConsumerInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:border-[#8C1D24] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={isFetching}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold whitespace-nowrap"
                  >
                    {isFetching ? 'Fetching...' : 'Fetch Bill'}
                  </button>
                </div>
              </div>

              {fetchedBill && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs animate-in fade-in">
                  <div className="flex justify-between text-slate-600">
                    <span>Registered Consumer:</span>
                    <strong className="text-slate-900">{fetchedBill.consumerName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Billing Period:</span>
                    <span className="text-slate-900">{fetchedBill.billPeriod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Due Date:</span>
                    <strong className="text-amber-700">{fetchedBill.dueDate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                    <span>Payable Amount:</span>
                    <strong className="text-[#8C1D24]">₹{fetchedBill.dueAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-800 font-sans text-[11px] mt-2">
                    Payment will be debited from primary account: <strong>000401589412</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveBiller(null);
                      onAttemptDebitAction();
                    }}
                    className="w-full mt-3 py-3 rounded-2xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-bold font-sans text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Pay Bill</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
