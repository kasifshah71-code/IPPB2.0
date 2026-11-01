import React, { useState } from 'react';
import { Eye, EyeOff, Send, QrCode, FileText, Copy, Check, ShieldCheck, ArrowUpRight, ArrowDownLeft, Sparkles, Crown } from 'lucide-react';
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

  // Calculate summary
  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8C1D24] via-[#A8252C] to-[#590F14] text-white p-5 sm:p-7 shadow-2xl border border-red-900/60">
      {/* Decorative Warm Glow & Watermark */}
      <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-[#F37021]/15 blur-2xl pointer-events-none" />
      <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
        <div className="w-28 h-28 rounded-full border-4 border-dashed border-white flex items-center justify-center font-black text-2xl rotate-12 font-serif italic">
          ICICI
        </div>
      </div>

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold tracking-wider text-orange-200 uppercase bg-black/30 px-3 py-0.5 rounded-full border border-orange-400/30 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-300" />
              Privilege Wealth Account
            </span>
            <span className="text-[11px] text-orange-200/90 font-mono">
              IFSC: <strong className="text-white font-bold">{user.ifsc}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-1">
            <span>{user.name}</span>
            <span title="KYC Verified Wealth Customer" className="inline-flex">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <button
              onClick={() => setShowFullAccount(!showFullAccount)}
              className="text-xs text-orange-200 hover:text-white font-mono flex items-center gap-1.5 transition-colors"
            >
              <span>A/C: {showFullAccount ? user.accountNumber : user.maskedAccountNumber}</span>
            </button>
            <button
              onClick={handleCopyAccount}
              title="Copy Account Number"
              className="p-1 hover:bg-white/10 rounded transition-colors text-orange-200 hover:text-white"
            >
              {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] text-orange-200 bg-white/10 px-2 py-0.5 rounded-full font-medium">
              Branch: {user.branch.split(',')[0]}
            </span>
          </div>
        </div>

        {/* ICICI Bank iMobile Brand Crest */}
        <div className="shrink-0 text-right">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F37021] to-amber-400 text-white font-serif italic text-2xl font-black flex items-center justify-center shadow-lg border border-white/30 ml-auto">
            i
          </div>
          <span className="text-[10px] text-orange-200 font-bold block mt-1 tracking-wider uppercase">
            iMobile Pay
          </span>
        </div>
      </div>

      {/* Available Balance Box */}
      <div className="relative z-10 my-6 bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-inner">
        <div className="flex items-center justify-between text-xs text-orange-200/90 mb-1">
          <span className="font-semibold tracking-wide">Available Balance (INR)</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1 text-orange-300 hover:text-orange-200 text-xs transition-colors font-medium"
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
          <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
            {showBalance ? `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••••••'}
          </span>
          {showBalance && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              Active
            </span>
          )}
        </div>

        {/* UPI ID tag & cashflow summary */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-orange-200/90 gap-2">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-orange-300 font-sans font-semibold">Primary UPI:</span>
            <span className="text-white bg-white/15 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-white/10">
              {user.upiId}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-300 flex items-center gap-1 font-mono font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-400/30">
              <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> Received Inflow: ₹{totalCredits.toLocaleString('en-IN')}
            </span>
            <span className="text-rose-200 flex items-center gap-1 font-mono font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Debit Freeze
            </span>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Send Money - Primary highlight in ICICI Orange */}
        <button
          onClick={onOpenTransfer}
          className="col-span-1 bg-gradient-to-r from-[#F37021] to-[#E35E10] hover:from-[#e06214] hover:to-[#ce520c] active:scale-95 text-white font-bold px-3 py-3 rounded-xl shadow-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group border border-orange-400/40"
        >
          <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs sm:text-sm">Fund Transfer</span>
        </button>

        {/* Statement / Passbook */}
        <button
          onClick={onOpenStatement}
          className="col-span-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold px-3 py-3 rounded-xl border border-white/20 transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2"
        >
          <FileText className="w-4 h-4 text-orange-300" />
          <span className="text-xs sm:text-sm">Statement</span>
        </button>

        {/* Receive QR */}
        <button
          onClick={onOpenReceiveQR}
          className="col-span-1 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold px-3 py-3 rounded-xl border border-white/20 transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2"
        >
          <QrCode className="w-4 h-4 text-orange-300" />
          <span className="text-xs sm:text-sm">Receive QR</span>
        </button>
      </div>
    </div>
  );
};
