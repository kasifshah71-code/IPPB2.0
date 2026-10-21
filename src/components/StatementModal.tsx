import React from 'react';
import { X, Printer, Download, Building2, CheckCircle2 } from 'lucide-react';
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
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-[#8B0000] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm sm:text-base">
              Account Transaction Statement
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
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
          {/* Header Banner - Matching the style of the user's statement */}
          <div className="bg-[#2D0654] text-white p-5 rounded-2xl mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400 text-[#2D0654] font-black flex items-center justify-center text-lg">
                  n
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>navi</span>
                    <span className="text-xs font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded border border-white/20">
                      UPI
                    </span>
                  </h2>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                  {user.name}
                </h3>
                <p className="text-xs text-purple-200 font-mono">{user.mobile}</p>
              </div>
            </div>
          </div>

          {/* Statement title & intro text from the image */}
          <div className="mb-6 text-center border-b border-slate-200 pb-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Transaction statement from 20 Oct 2026 to 21 Oct 2026
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              All UPI, bill payments & recharges done via Navi are listed in this statement.
            </p>
          </div>

          {/* Account Meta Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
              <span className="font-bold text-slate-800">India Post Payments Bank</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Account</span>
              <span className="font-mono font-bold text-slate-800">...8231</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span>
              <span className="font-mono font-bold text-slate-800">{user.ifsc}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Balance</span>
              <span className="font-mono font-bold text-emerald-700">
                ₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Table Header matching the screenshot columns */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600 font-bold">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 px-4">Transaction details</th>
                  <th className="py-2.5 px-4">Account</th>
                  <th className="py-2.5 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => {
                  const isDebit = t.type === 'debit';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pr-4 align-top text-xs text-slate-600 whitespace-nowrap">
                        <span className="font-medium block text-slate-900">{t.date.split(',')[0]}</span>
                        <span className="text-[11px] text-slate-400">{t.date.split(',')[1]}</span>
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <p className="font-bold text-slate-900">{t.title}</p>
                        {t.recipientUpiId && (
                          <p className="text-[11px] font-mono font-semibold text-amber-900 mt-0.5">
                            UPI ID: <span className="bg-amber-50 px-1 py-0.2 rounded border border-amber-200">{t.recipientUpiId}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          UPI txn ID: {t.upiTxnId}
                        </p>
                        {t.note && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5">
                            Note: {t.note}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[7px] font-black shrink-0">
                            IP
                          </div>
                          <span className="text-slate-700 font-medium whitespace-nowrap">
                            {t.account}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 pl-4 align-top text-right whitespace-nowrap">
                        <span
                          className={`font-bold font-mono text-sm ${
                            isDebit ? 'text-slate-900' : 'text-emerald-600'
                          }`}
                        >
                          {isDebit ? '' : '+'}₹{t.amount.toLocaleString('en-IN', {
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
            <p>This is a computer-generated statement and requires no physical signature.</p>
            <p className="mt-1 font-semibold text-slate-600">Powered by UPI • India Post Payments Bank</p>
          </div>
        </div>
      </div>
    </div>
  );
};
