import React from 'react';
import { X, CheckCircle2, Download, Copy, Check, Printer, ShieldCheck } from 'lucide-react';
import { Transaction, UserAccount } from '../types/banking';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  user: UserAccount;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  user,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!transaction) return null;

  const isDebit = transaction.type === 'debit';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8C1D24] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F37021] to-[#B02A30] text-white font-serif italic font-black text-lg flex items-center justify-center border border-white/30">
              i
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block leading-tight">
                ICICI Bank e-Receipt
              </span>
              <span className="text-[10px] text-orange-200">
                Transaction Reference Details
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Status Badge & Amount */}
          <div className="text-center pb-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              Payment Completed
            </span>

            <h2 className={`text-3xl font-black font-mono mt-2 tracking-tight ${isDebit ? 'text-slate-900' : 'text-emerald-600'}`}>
              {isDebit ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>

            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {transaction.title}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800">{transaction.account}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Account Holder:</span>
              <span className="font-bold text-slate-800">{user.name}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Counterparty:</span>
              <span className="font-bold text-slate-900 uppercase">{transaction.recipientOrSender}</span>
            </div>

            {transaction.recipientUpiId && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Counterparty UPI ID:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 bg-orange-50 text-[#8C1D24] border border-orange-200 px-2 py-0.5 rounded-md">
                  <span>{transaction.recipientUpiId}</span>
                  <button
                    onClick={() => copyToClipboard(transaction.recipientUpiId!, 'recUpi')}
                    className="text-[#F37021] hover:text-[#8C1D24] p-0.5"
                    title="Copy Counterparty UPI ID"
                  >
                    {copiedField === 'recUpi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">UPI / Reference ID:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                <span>{transaction.upiTxnId}</span>
                <button
                  onClick={() => copyToClipboard(transaction.upiTxnId, 'upi')}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {transaction.utrNo && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">UTR Number:</span>
                <span className="font-mono text-slate-700">{transaction.utrNo}</span>
              </div>
            )}

            {transaction.note && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
                <span className="text-slate-500">Remark / Note:</span>
                <span className="text-slate-700 italic font-medium">{transaction.note}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-slate-200/70">
              <span className="text-slate-500">Date & Timestamp:</span>
              <span className="font-medium text-slate-800">{transaction.date}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Authorized Via:</span>
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <span>ICICI CBS & NPCI</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download e-Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
