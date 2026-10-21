import React, { useState } from 'react';
import { Eye, EyeOff, Send, QrCode, FileText, Copy, Check, ShieldCheck, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';
import { UserAccount, Transaction } from '../types/banking';

interface AccountCardProps {
  user: UserAccount;
  transactions: Transaction[];
  onOpenTransfer: () => void;
  onOpenStatement: () => void;
  onOpenReceiveQR: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  user,
  transactions,
  onOpenTransfer,
  onOpenStatement,
  onOpenReceiveQR,
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [copiedAcc, setCopiedAcc] = useState<boolean>(false);
  const [showFullAccount, setShowFullAccount] = useState<boolean>(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(user.accountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  // Calculate 2-day summary
  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B0000] via-[#990000] to-[#5a0000] text-white p-5 sm:p-7 shadow-2xl border border-red-800/60">
      {/* Decorative Gold & Postal Stamp watermark */}
      <div className="absolute -right-8 -bottom-8 w-56 h-56 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
        <div className="w-28 h-28 rounded-full border-4 border-dashed border-white flex items-center justify-center font-black text-2xl rotate-12">
          IPPB
        </div>
      </div>

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase bg-black/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
              Savings Account
            </span>
            <span className="text-[11px] text-red-200">
              IFSC: <strong className="text-white font-mono">{user.ifsc}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{user.name}</span>
            <span title="KYC Verified Customer" className="inline-flex">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <button
              onClick={() => setShowFullAccount(!showFullAccount)}
              className="text-xs text-red-200 hover:text-white font-mono flex items-center gap-1.5 transition-colors"
            >
              <span>A/C: {showFullAccount ? user.accountNumber : user.maskedAccountNumber}</span>
            </button>
            <button
              onClick={handleCopyAccount}
              title="Copy Account Number"
              className="p-1 hover:bg-white/10 rounded transition-colors text-red-200 hover:text-white"
            >
              {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] text-amber-300/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
              Branch: {user.branch.split('/')[0]}
            </span>
          </div>
        </div>

        {/* IPPB Gold Emblem */}
        <div className="shrink-0 text-right">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#8B0000] font-black text-lg flex items-center justify-center shadow-lg border border-amber-300/60 ml-auto">
            ₹
          </div>
          <span className="text-[10px] text-amber-200 font-semibold block mt-1">
            IPPB Direct
          </span>
        </div>
      </div>

      {/* Available Balance Box */}
      <div className="relative z-10 my-6 bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10">
        <div className="flex items-center justify-between text-xs text-red-200 mb-1">
          <span className="font-medium tracking-wide">Available Account Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 text-xs transition-colors"
          >
            {showBalance ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {showBalance ? `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </span>
          {showBalance && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              Active
            </span>
          )}
        </div>

        {/* UPI ID tag */}
        <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-red-200 gap-2">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-amber-300 font-sans">Primary UPI:</span>
            <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[11px]">{user.upiId}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-rose-300 flex items-center gap-0.5 font-mono">
              <ArrowUpRight className="w-3 h-3" /> Spent: ₹{totalDebits.toLocaleString('en-IN')}
            </span>
            <span className="text-emerald-300 flex items-center gap-0.5 font-mono">
              <ArrowDownLeft className="w-3 h-3" /> In: ₹{totalCredits.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Send Money - Primary highlight */}
        <button
          onClick={onOpenTransfer}
          className="col-span-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-bold px-3 py-3 rounded-xl shadow-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group"
        >
          <Send className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs sm:text-sm">Send Money</span>
        </button>

        {/* Passbook / Statement */}
        <button
          onClick={onOpenStatement}
          className="col-span-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold px-3 py-3 rounded-xl border border-white/20 transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span className="text-xs sm:text-sm">Statement</span>
        </button>

        {/* Receive QR */}
        <button
          onClick={onOpenReceiveQR}
          className="col-span-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold px-3 py-3 rounded-xl border border-white/20 transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2"
        >
          <QrCode className="w-4 h-4 text-amber-300" />
          <span className="text-xs sm:text-sm">Receive QR</span>
        </button>
      </div>
    </div>
  );
};
