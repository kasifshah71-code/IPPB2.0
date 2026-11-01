import React from 'react';
import { X, Printer, Building2, Crown, ShieldCheck } from 'lucide-react';
import { Transaction, UserAccount } from '../types/banking';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  transactions: Transaction[];
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
  user,
  transactions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-[#8C1D24] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-300" />
            <h3 className="font-bold text-sm sm:text-base">
              ICICI Bank Official Account Statement
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#8C1D24] via-[#A0232A] to-[#601016] text-white p-6 rounded-2xl mb-6 shadow-md border border-red-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F37021] to-amber-400 text-white font-serif italic text-3xl font-black flex items-center justify-center shadow-md">
                  i
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>ICICI Bank</span>
                    <span className="text-xs font-bold text-orange-200 bg-white/10 px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider">
                      Privilege Wealth
                    </span>
                  </h2>
                  <p className="text-xs text-orange-200/90 font-medium">
                    ICICI Bank Tower, Bandra-Kurla Complex, Mumbai 400051
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/20">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide flex sm:justify-end items-center gap-1 text-white">
                  <span>{user.name}</span>
                  <Crown className="w-4 h-4 text-amber-300" />
                </h3>
                <p className="text-xs text-orange-200 font-mono">{user.mobile}</p>
                <p className="text-[11px] text-orange-200/80">Reg. UPI: {user.upiId}</p>
              </div>
            </div>
          </div>

          {/* Statement title & intro text */}
          <div className="mb-6 text-center border-b border-slate-200 pb-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Account Transaction Inflow Statement for Period: 17 Oct 2026 to 22 Oct 2026
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              All 10 Received Credits & Inflows totaling ₹68,00,000.00 verified by ICICI Core Banking System.
            </p>
          </div>

          {/* Account Meta Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank & Branch</span>
              <span className="font-bold text-slate-800">ICICI Bank, Connaught Place</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Number</span>
              <span className="font-mono font-bold text-slate-800">{user.maskedAccountNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span>
              <span className="font-mono font-bold text-slate-800">{user.ifsc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Balance</span>
              <span className="font-mono font-black text-emerald-700 text-sm">
                ₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600 font-bold bg-slate-50/60">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Transaction Details</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => {
                  const isDebit = t.type === 'debit';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 align-top text-xs text-slate-600 whitespace-nowrap">
                        <span className="font-semibold block text-slate-900">{t.date.split(',')[0]}</span>
                        <span className="text-[11px] text-slate-400">{t.date.split(',')[1]}</span>
                      </td>

                      <td className="py-3 px-3 align-top">
                        <p className="font-bold text-slate-900">{t.title}</p>
                        {t.recipientUpiId && (
                          <p className="text-[11px] font-mono font-semibold text-[#8C1D24] mt-0.5">
                            UPI ID: <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">{t.recipientUpiId}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Ref: {t.upiTxnId} {t.utrNo ? `• UTR: ${t.utrNo}` : ''}
                        </p>
                        {t.note && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5">
                            Note: {t.note}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700">
                          {t.mode || 'IMPS'}
                        </span>
                      </td>

                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <span
                          className={`font-black font-mono text-sm ${
                            isDebit ? 'text-slate-900' : 'text-emerald-600'
                          }`}
                        >
                          {isDebit ? '-' : '+'}₹{t.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: t.amount % 1 === 0 ? 0 : 2,
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
            <p>This is a computer-generated account statement issued by ICICI Bank Ltd. and requires no physical signature.</p>
            <p className="mt-1 font-semibold text-slate-600">CIN: L24299GJ1994PLC022388 • Member NPCI & RBI Regulated</p>
          </div>
        </div>
      </div>
    </div>
  );
};
