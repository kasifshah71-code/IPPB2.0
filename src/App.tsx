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
import { ReceiveMoneyModal } from './components/ReceiveMoneyModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { CardsView } from './components/CardsView';
import { LoansView } from './components/LoansView';
import { DepositsView } from './components/DepositsView';
import { BillPayView } from './components/BillPayView';
import { ServicesView } from './components/ServicesView';
import { BottomNav } from './components/BottomNav';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/initialData';
import { UserAccount, Transaction, TransferType, TabType } from './types/banking';
import { Lock, Crown, PhoneCall, ArrowRight } from 'lucide-react';
import { useFullscreen } from './utils/fullscreen';

export default function App() {
  // Authentication state - Starts locked with clean MPIN prompt
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Active section tab state
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // User account state with ICICI storage key
  const [user, setUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('icici_user_account_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  // Transactions state with ICICI 17-22 Oct receive-only storage key
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('icici_transactions_v2_oct17_22');
      if (saved) return JSON.parse(saved);
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
  const [isReceiveQRModalOpen, setIsReceiveQRModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Persist transactions and balance
  useEffect(() => {
    try {
      localStorage.setItem('icici_user_account_v2', JSON.stringify(user));
      localStorage.setItem('icici_transactions_v2_oct17_22', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [user, transactions]);

  // Handle successful fund transfer (Intercepted by freeze in real flow)
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
    if (window.confirm('Reset balance to ₹68,00,000 and restore ICICI default statement transactions?')) {
      setUser(INITIAL_USER);
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.removeItem('icici_user_account_v1');
      localStorage.removeItem('icici_transactions_v1');
    }
  };

  // If user is not authenticated, show clean MPIN screen
  if (!isAuthenticated) {
    return (
      <>
        <MpinScreen
          userName={user.name}
          onSuccess={() => setIsAuthenticated(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        />
        <DownloadAppModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-20">
      {/* Top Navigation with Applet Brand and Category Tabs */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onLogout={() => setIsAuthenticated(false)}
        onOpenStatement={() => setIsStatementModalOpen(true)}
        onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Privilege Wealth Verification Banner */}
        <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-amber-500/10 border border-orange-400/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-900">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">
              ICICI Bank The Privilege Wealth Account • Verified Holder:{' '}
              <strong className="text-[#8C1D24] font-black">{user.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-md border border-slate-200">
              Active Balance: ₹{user.balance.toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => setIsStatementModalOpen(true)}
              className="text-[#8C1D24] font-bold hover:underline flex items-center gap-1"
            >
              <span>e-Statement (17-22 Oct)</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Account Frozen & Blocked Warning Alert Banner */}
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-red-800 text-sm flex items-center gap-1.5">
                <span>Account Status: DEBIT FREEZE & BLOCKED</span>
                <span className="text-[10px] bg-red-200 text-red-900 px-2 py-0.2 rounded font-mono font-bold">
                  ICICI-FRZ-SEC-68L
                </span>
              </p>
              <p className="text-slate-600 mt-0.5">
                Total received inflow of ₹68,00,000 (17 Oct – 22 Oct). All outward fund transfers are suspended.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('services')}
              className="px-3 py-1.5 rounded-xl bg-white text-red-800 hover:bg-red-50 font-bold border border-red-300 text-xs text-center flex-1 sm:flex-none"
            >
              Case File
            </button>
            <button
              onClick={() => handleOpenTransfer('bank')}
              className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold transition-all shadow-sm text-xs whitespace-nowrap flex-1 sm:flex-none text-center"
            >
              Attempt Transfer
            </button>
          </div>
        </div>

        {/* VIEW CONDITIONAL RENDERING BASED ON ACTIVE TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Primary Account Card */}
            <AccountCard
              user={user}
              transactions={transactions}
              onOpenTransfer={() => handleOpenTransfer('bank')}
              onOpenStatement={() => setIsStatementModalOpen(true)}
              onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
            />

            {/* Quick Actions Grid with Tab Navigators */}
            <QuickActions
              onOpenTransfer={handleOpenTransfer}
              onOpenReceiveQR={() => setIsReceiveQRModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Transaction History (17-22 Oct Only Received transactions totaling 68 Lakhs) */}
            <TransactionHistory
              transactions={transactions}
              onSelectTransaction={(txn) => setSelectedTxn(txn)}
              onOpenStatement={() => setIsStatementModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'cards' && (
          <CardsView onAttemptDebitAction={() => handleOpenTransfer('bank')} />
        )}

        {activeTab === 'loans' && (
          <LoansView
            onAttemptDebitAction={() => handleOpenTransfer('bank')}
            userName={user.name}
          />
        )}

        {activeTab === 'deposits' && (
          <DepositsView
            savingsBalance={user.balance}
            userName={user.name}
          />
        )}

        {activeTab === 'bills' && (
          <BillPayView
            onAttemptDebitAction={() => handleOpenTransfer('bank')}
            userName={user.name}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            user={user}
            onAttemptDebitAction={() => handleOpenTransfer('bank')}
          />
        )}

        {/* Wealth Relationship Manager & Security Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F37021] flex items-center justify-center font-bold shrink-0 border border-orange-200">
              <Crown className="w-5 h-5 text-[#F37021]" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Privilege Wealth Desk & 24x7 Concierge</p>
              <p className="text-slate-500">Dedicated Priority Line: 1800 1080 • Email: wealthsupport@icicibank.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-600 underline text-[11px]"
            >
              Reset to ₹68,00,000
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock App</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile & Instant Switching */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-200">
              ICICI Bank Ltd. (iMobile Pay)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Registered Office: ICICI Bank Tower, Near Chakli Circle, Old Padra Road, Vadodara 390007, Gujarat, India.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>256-Bit SSL Secured</span>
            <span>•</span>
            <span>NPCI Unified Payments</span>
            <span>•</span>
            <span>RBI Supervised</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Money Transfer Modal (Blocks transfers with frozen notice) */}
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

      {/* 4. Receive Money / QR Modal */}
      <ReceiveMoneyModal
        isOpen={isReceiveQRModalOpen}
        onClose={() => setIsReceiveQRModalOpen(false)}
        user={user}
      />

      {/* 5. Download & Install App PWA Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
