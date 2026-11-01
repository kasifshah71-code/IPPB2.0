import React, { useState } from 'react';
import { FixedDepositData } from '../types/banking';
import { INITIAL_FIXED_DEPOSITS, INITIAL_MUTUAL_FUNDS } from '../data/bankingExtensions';
import { TrendingUp, PiggyBank, PlusCircle, ShieldCheck, ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, Building2, Calendar } from 'lucide-react';

interface DepositsViewProps {
  savingsBalance: number;
  userName: string;
}

export const DepositsView: React.FC<DepositsViewProps> = ({ savingsBalance, userName }) => {
  const [fixedDeposits, setFixedDeposits] = useState<FixedDepositData[]>(INITIAL_FIXED_DEPOSITS);
  const [isNewFdModalOpen, setIsNewFdModalOpen] = useState(false);
  const [fdAmount, setFdAmount] = useState<number>(500000);
  const [fdTenureMonths, setFdTenureMonths] = useState<number>(24);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Totals
  const totalFdPrincipal = fixedDeposits.reduce((acc, fd) => acc + fd.principalAmount, 0);
  const totalMfValue = INITIAL_MUTUAL_FUNDS.reduce((acc, mf) => acc + mf.currentValue, 0);
  const totalNetWealth = savingsBalance + totalFdPrincipal + totalMfValue;

  const calculateFdMaturity = (p: number, months: number, rate: number = 7.25) => {
    const years = months / 12;
    // quarterly compound
    const n = 4;
    const r = rate / 100;
    const maturity = p * Math.pow(1 + r / n, n * years);
    return Math.round(maturity);
  };

  const handleCreateFd = (e: React.FormEvent) => {
    e.preventDefault();
    const newFd: FixedDepositData = {
      id: `fd_new_${Date.now()}`,
      accountNumber: `000414${Math.floor(100000 + Math.random() * 900000)}`,
      holderName: userName,
      principalAmount: fdAmount,
      interestRate: 7.25,
      maturityAmount: calculateFdMaturity(fdAmount, fdTenureMonths),
      startDate: '31 Oct 2026',
      maturityDate: `${monthsAhead(fdTenureMonths)}`,
      type: 'CUMULATIVE',
      status: 'ACTIVE',
    };

    setFixedDeposits([newFd, ...fixedDeposits]);
    setIsNewFdModalOpen(false);
    setSuccessToast(`New Fixed Deposit of ₹${fdAmount.toLocaleString('en-IN')} opened successfully! Account: ${newFd.accountNumber}`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  function monthsAhead(m: number): string {
    const d = new Date();
    d.setMonth(d.getMonth() + m);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 shadow-lg text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#8C1D24]" />
            <span>Deposits & Wealth Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Total Net Worth & Investment Portfolio for {userName}
          </p>
        </div>
        <button
          onClick={() => setIsNewFdModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#8C1D24] hover:bg-[#6e161c] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open New Fixed Deposit</span>
        </button>
      </div>

      {/* Net Worth Portfolio Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 rounded-3xl p-6 text-white shadow-xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-300 font-mono uppercase tracking-wider">
              Total Wealth Valuation (AUM)
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-amber-200 mt-1 font-mono">
              ₹{totalNetWealth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Consolidated holding across Savings, Term Deposits, and Mutual Funds
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:text-right text-xs">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Savings A/C</span>
              <span className="font-bold text-white font-mono">₹68.00 Lakhs</span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Fixed Deposits</span>
              <span className="font-bold text-amber-300 font-mono">
                ₹{(totalFdPrincipal / 100000).toFixed(2)} Lakhs
              </span>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-stone-300 block">Mutual Funds</span>
              <span className="font-bold text-emerald-300 font-mono">
                ₹{(totalMfValue / 100000).toFixed(2)} Lakhs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Fixed Deposits List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-[#8C1D24]" />
            <span>Active Term Deposits ({fixedDeposits.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Yielding up to 7.25% p.a.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedDeposits.map((fd) => (
            <div
              key={fd.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      FD A/C {fd.accountNumber}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {fd.type === 'CUMULATIVE' ? 'Cumulative Wealth Deposit' : 'Tax Saver 80C Deposit'}
                    </p>
                  </div>
                  <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                    {fd.interestRate}% p.a.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Principal Deposited</span>
                    <span className="font-mono font-black text-slate-900 text-base">
                      ₹{fd.principalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Maturity Value</span>
                    <span className="font-mono font-black text-emerald-700 text-base">
                      ₹{fd.maturityAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Matures on: <strong>{fd.maturityDate}</strong></span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  Auto-Renew ON
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mutual Funds Portfolio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>ICICI Prudential Mutual Funds Portfolio</span>
          </h3>
          <span className="text-xs text-emerald-700 font-bold">Overall Gain +32.8%</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
          {INITIAL_MUTUAL_FUNDS.map((mf) => (
            <div key={mf.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-bold text-slate-900">{mf.schemeName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {mf.category} • Current NAV: ₹{mf.nav} • Units: {mf.units}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 block">Invested</span>
                  <span className="font-mono font-bold text-slate-700">₹{mf.investedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Value</span>
                  <span className="font-mono font-black text-slate-900">₹{mf.currentValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Returns</span>
                  <span className="font-bold text-emerald-600">+{mf.returnsPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New FD Modal */}
      {isNewFdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#8C1D24]" />
                <span>Open Instant Fixed Deposit</span>
              </h3>
              <button
                onClick={() => setIsNewFdModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFd} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  min={10000}
                  step={10000}
                  value={fdAmount}
                  onChange={(e) => setFdAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:border-[#8C1D24] focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Debited from Privilege Wealth A/C ending 9412
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tenure (Months)
                </label>
                <select
                  value={fdTenureMonths}
                  onChange={(e) => setFdTenureMonths(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:border-[#8C1D24] focus:outline-hidden"
                >
                  <option value={12}>1 Year (12 Months) @ 7.10%</option>
                  <option value={24}>2 Years (24 Months) @ 7.25%</option>
                  <option value={36}>3 Years (36 Months) @ 7.20%</option>
                  <option value={60}>5 Years Tax Saver (60 Months) @ 7.00%</option>
                </select>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-900 font-medium">Estimated Maturity:</span>
                  <span className="font-mono font-black text-amber-950 text-sm">
                    ₹{calculateFdMaturity(fdAmount, fdTenureMonths).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#8C1D24] hover:bg-[#6e161c] text-white font-bold text-xs transition-colors"
              >
                Confirm & Create Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
