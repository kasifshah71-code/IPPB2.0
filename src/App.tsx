/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MpinScreen } from './components/MpinScreen';
import { Navbar } from './components/Navbar';
import { AccountCard } from './components/AccountCard';
import { QuickActions } from './components/QuickActions';
import { TransactionHistory } from './components/TransactionHistory';
import { TransferModal } from './components/TransferModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { StatementModal } from './components/StatementModal';
import { OriginalStatementModal } from './components/OriginalStatementModal';
import { ReceiveMoneyModal } from './components/ReceiveMoneyModal';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/initialData';
import { UserAccount, Transaction, TransferType } from './types/banking';
import { ShieldCheck, PhoneCall, HelpCircle, Lock, Building2, CheckCircle2 } from 'lucide-react';
import { useFullscreen } from './utils/fullscreen';

export default function App() {
  // Authentication state - Starts locked with MPIN prompt as requested
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // User account state
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('ippb_user_account');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  // Transactions state - includes recipient UPI ID migration
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedV2 = localStorage.getItem('ippb_transactions_v2');
      if (savedV2) return JSON.parse(savedV2);

      const oldSaved = localStorage.getItem('ippb_transactions');
      if (oldSaved) {
        const parsed: Transaction[] = JSON.parse(oldSaved);
        // Merge recipientUpiId from INITIAL_TRANSACTIONS matching by amount and title
        const merged = parsed.map((pt) => {
          const match = INITIAL_TRANSACTIONS.find(
            (it) => it.id === pt.id || (it.amount === pt.amount && it.title === pt.title)
          );
          return match ? { ...pt, recipientUpiId: match.recipientUpiId } : pt;
        });
        return merged;
      }
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<TransferType>('bank');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isOriginalImageModalOpen, setIsOriginalImageModalOpen] = useState(false);
  const [isReceiveQRModalOpen, setIsReceiveQRModalOpen] = useState(false);

  // Persist transactions and balance
  useEffect(() => {
    try {
      localStorage.setItem('ippb_user_account', JSON.stringify(user));
      localStorage.setItem('ippb_transactions_v2', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [user, transactions]);

  // Handle successful fund transfer
  const handleTransferComplete = (newTxn: Transaction, newBalance: number) => {
    setUser((prev) => ({
      ...prev,
      balance: newBalance,
    }));
    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Open transfer modal with optional specific mode
  const handleOpenTransfer = (type: TransferType = 'bank') => {
    setTransferType(type);
    setIsTransferModalOpen(true);
  };

  // Reset to original data helper
  const handleResetData = () => {
    if (window.confirm('Reset balance and transactions to default statement values?')) {
      setUser(INITIAL_USER);
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.removeItem('ippb_user_account');
      localStorage.removeItem('ippb_transactions');
      localStorage.removeItem('ippb_transactions_v2');
    }
  };

  // If user is not authenticated, show MPIN screen
  if (!isAuthenticated) {
    return (
      <MpinScreen
        userName={user.name}
        onSuccess={() => setIsAuthenticated(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <Navbar
        user={user}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onLogout={() => setIsAuthenticated(false)}
        onOpenStatement={() => setIsStatementModalOpen(true)}
        onOpenOriginalImage={() => setIsOriginalImageModalOpen(true)}
        onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Verification banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              India Post Payments Bank (IPPB) • Verified Account: {user.name}
            </span>
          </div>
          <button
            onClick={() => setIsOriginalImageModalOpen(true)}
            className="text-[#8B0000] font-bold hover:underline flex items-center gap-1"
          >
            <span>Compare with Uploaded Statement Screenshot</span>
            <span>→</span>
          </button>
        </div>

        {/* Primary Account Debit / Savings Card */}
        <AccountCard
          user={user}
          transactions={transactions}
          onOpenTransfer={() => handleOpenTransfer('bank')}
          onOpenStatement={() => setIsStatementModalOpen(true)}
          onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
        />

        {/* Quick Actions Grid */}
        <QuickActions
          onOpenTransfer={handleOpenTransfer}
          onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
        />

        {/* Transaction History (Last 10 transactions matching the user's uploaded statement) */}
        <TransactionHistory
          transactions={transactions}
          onSelectTransaction={(txn) => setSelectedTxn(txn)}
          onOpenStatement={() => setIsStatementModalOpen(true)}
        />

        {/* Help & Security Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">24x7 Customer Support & Grievance</p>
              <p className="text-slate-500">Call Toll-Free 155299 or email contact@ippbonline.in</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-600 underline text-[11px]"
            >
              Reset Statement Data
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock App</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-200">
              India Post Payments Bank Ltd. (IPPB)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Department of Posts, Ministry of Communications, Government of India.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Secure 256-Bit SSL</span>
            <span>•</span>
            <span>NPCI UPI Verified</span>
            <span>•</span>
            <span>Aadhaar AePS</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Money Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        user={user}
        defaultType={transferType}
        onTransferComplete={handleTransferComplete}
      />

      {/* 2. Transaction Receipt Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        user={user}
      />

      {/* 3. Full Statement Modal */}
      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        user={user}
        transactions={transactions}
      />

      {/* 4. Original Image Viewer Modal */}
      <OriginalStatementModal
        isOpen={isOriginalImageModalOpen}
        onClose={() => setIsOriginalImageModalOpen(false)}
      />

      {/* 5. Receive Money / QR Modal */}
      <ReceiveMoneyModal
        isOpen={isReceiveQRModalOpen}
        onClose={() => setIsReceiveQRModalOpen(false)}
        user={user}
      />
    </div>
  );
}
