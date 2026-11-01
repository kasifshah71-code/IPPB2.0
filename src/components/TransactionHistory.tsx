import React, { useState, useMemo } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, ChevronRight, CheckCircle2, Filter, Download } from 'lucide-react';
import { Transaction } from '../types/banking';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  onOpenStatement: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onSelectTransaction,
  onOpenStatement,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Type filter
      if (filterType === 'DEBIT' && txn.type !== 'debit') return false;
      if (filterType === 'CREDIT' && txn.type !== 'credit') return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = txn.recipientOrSender.toLowerCase().includes(q);
        const matchesTitle = txn.title.toLowerCase().includes(q);
        const matchesUpi = txn.upiTxnId.toLowerCase().includes(q);
        const matchesRecipientUpi = (txn.recipientUpiId || '').toLowerCase().includes(q);
        const matchesNote = txn.note.toLowerCase().includes(q);
        const matchesAmount = txn.amount.toString().includes(q);
        return matchesName || matchesTitle || matchesUpi || matchesRecipientUpi || matchesNote || matchesAmount;
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/90">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Transaction History (Received Inflow)
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              17 Oct – 22 Oct (10 Credits)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Account: <strong className="text-slate-800">ICICI Bank - 9412</strong> • Total Received: <strong className="text-emerald-700 font-mono font-bold">₹68,00,000.00</strong>
          </p>
        </div>

        <button
          onClick={onOpenStatement}
          className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-[#8C1D24] hover:text-[#6a141a] bg-red-50 hover:bg-red-100 border border-red-200/60 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Statement (17-22 Oct)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 my-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transactions by beneficiary, UPI ID, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#F37021] bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('DEBIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterType === 'DEBIT'
                ? 'bg-[#8C1D24] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            Debits
          </button>
          <button
            onClick={() => setFilterType('CREDIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterType === 'CREDIT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3 h-3" />
            Credits
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No transactions match your search</p>
            <button
              onClick={() => {
                setFilterType('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-[#8C1D24] font-semibold mt-1 underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const isDebit = txn.type === 'debit';
            return (
              <div
                key={txn.id}
                onClick={() => onSelectTransaction(txn)}
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  {/* Circular badge with ICICI 'i' symbol */}
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                        isDebit
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isDebit ? (
                        <ArrowUpRight className="w-5 h-5 text-rose-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    {/* Small ICICI indicator badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#8C1D24] text-white text-[8px] font-black flex items-center justify-center border border-white font-serif italic">
                      i
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#8C1D24] transition-colors truncate">
                        {txn.title}
                      </h4>
                      <span title="Success" className="inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </span>
                    </div>

                    {txn.recipientUpiId && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">UPI ID:</span>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-orange-50 text-[#8C1D24] border border-orange-200 px-2 py-0.5 rounded-md inline-flex items-center">
                          {txn.recipientUpiId}
                        </span>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Ref / Txn ID: <span className="text-slate-700 font-medium">{txn.upiTxnId}</span>
                      {txn.mode && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          {txn.mode}
                        </span>
                      )}
                    </p>

                    {txn.note && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5 truncate">
                        Note: {txn.note}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{txn.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">{txn.account}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Arrow */}
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <span
                      className={`text-sm sm:text-base font-extrabold font-mono tracking-tight block ${
                        isDebit ? 'text-slate-900' : 'text-emerald-600'
                      }`}
                    >
                      {isDebit ? '-' : '+'}₹
                      {txn.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: txn.amount % 1 === 0 ? 0 : 2,
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isDebit ? 'Debited' : 'Credited'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Statement Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Verified via ICICI Core Banking System</span>
        <button
          onClick={onOpenStatement}
          className="text-[#8C1D24] font-semibold hover:underline"
        >
          View Full Statement & Tax Summary →
        </button>
      </div>
    </div>
  );
};
