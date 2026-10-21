import React, { useState } from 'react';
import { X, Building, Send, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Download, Share2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, Transaction, TransferType } from '../types/banking';
import { QUICK_BENEFICIARIES, POPULAR_BANKS } from '../data/initialData';
import { playKeypadClick, playSuccessSound, playErrorBeep } from '../utils/audio';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  defaultType?: TransferType;
  onTransferComplete: (newTxn: Transaction, newBalance: number) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  user,
  defaultType = 'bank',
  onTransferComplete,
}) => {
  const [transferType, setTransferType] = useState<TransferType>(defaultType);
  const [step, setStep] = useState<'form' | 'confirm' | 'mpin' | 'success'>('form');

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [remark, setRemark] = useState('');
  const [mode, setMode] = useState<'IMPS' | 'NEFT' | 'UPI'>('IMPS');

  // MPIN State
  const [enteredMpin, setEnteredMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Success state
  const [createdTxn, setCreatedTxn] = useState<Transaction | null>(null);

  if (!isOpen) return null;

  const handleSelectBeneficiary = (b: typeof QUICK_BENEFICIARIES[0]) => {
    setRecipientName(b.name);
    setAccountNumber(b.accountNumber);
    setConfirmAccount(b.accountNumber);
    setIfsc(b.ifsc);
    setBankName(b.bankName);
    setUpiId(b.upiId);
  };

  const handleSelectBank = (b: typeof POPULAR_BANKS[0]) => {
    setBankName(b.name);
    if (!ifsc) {
      setIfsc(b.ifscPrefix + '001');
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const isFormValid = () => {
    if (numAmount <= 0 || numAmount > user.balance) return false;
    if (!recipientName.trim()) return false;

    if (transferType === 'bank') {
      if (!accountNumber || accountNumber.length < 8) return false;
      if (accountNumber !== confirmAccount) return false;
      if (!ifsc || ifsc.length < 6) return false;
    } else if (transferType === 'upi') {
      if (!upiId || !upiId.includes('@')) return false;
    }
    return true;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setStep('confirm');
  };

  const handleProceedToMpin = () => {
    setEnteredMpin('');
    setMpinError('');
    setStep('mpin');
  };

  const handleMpinDigit = (digit: string) => {
    if (enteredMpin.length < 4) {
      playKeypadClick();
      const newPin = enteredMpin + digit;
      setEnteredMpin(newPin);
      setMpinError('');

      if (newPin.length === 4) {
        verifyMpinAndExecute(newPin);
      }
    }
  };

  const handleMpinDelete = () => {
    playKeypadClick();
    setEnteredMpin((prev) => prev.slice(0, -1));
  };

  const verifyMpinAndExecute = (pin: string) => {
    if (pin !== '4444') {
      playErrorBeep();
      setMpinError('Invalid MPIN. Use 4444');
      setTimeout(() => setEnteredMpin(''), 500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      executeTransfer();
    }, 1200);
  };

  const executeTransfer = () => {
    const txnId = 'TXN-' + Date.now();
    const upiRef = '629' + Math.floor(100000000 + Math.random() * 900000000);
    const newBalance = user.balance - numAmount;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newTxn: Transaction = {
      id: txnId,
      date: formattedDate,
      timestamp: Date.now(),
      type: 'debit',
      title: `Paid to ${recipientName.toUpperCase()}`,
      recipientOrSender: recipientName.toUpperCase(),
      recipientUpiId: upiId ? upiId : (transferType === 'upi' ? `${recipientName.toLowerCase().replace(/\s+/g, '')}@okaxis` : undefined),
      amount: numAmount,
      upiTxnId: upiRef,
      utrNo: upiRef,
      note: remark.trim() || 'Paid via IPPB Mobile Banking',
      account: 'India Post Payments Bank - 8231',
      mode: transferType === 'upi' ? 'UPI' : 'IMPS',
      status: 'SUCCESS',
      category: 'Transfer',
    };

    setCreatedTxn(newTxn);
    setStep('success');
    playSuccessSound();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B0000', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch {
      // Ignore
    }

    onTransferComplete(newTxn, newBalance);
  };

  const resetForm = () => {
    setRecipientName('');
    setAccountNumber('');
    setConfirmAccount('');
    setIfsc('');
    setBankName('');
    setUpiId('');
    setAmount('');
    setRemark('');
    setEnteredMpin('');
    setStep('form');
    setCreatedTxn(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-[#8B0000] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-[#8B0000] font-black text-xs flex items-center justify-center">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Transfer Money
              </h3>
              <p className="text-[11px] text-red-200">
                From: LALIT SHERKE • IPPB - 8231 (Bal: ₹{user.balance.toLocaleString('en-IN')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleProceedToConfirm} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Transfer Type Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTransferType('bank')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  transferType === 'bank'
                    ? 'bg-white text-[#8B0000] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>To Bank Account</span>
              </button>
              <button
                type="button"
                onClick={() => setTransferType('upi')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  transferType === 'upi'
                    ? 'bg-white text-[#8B0000] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>To UPI ID / VPA</span>
              </button>
            </div>

            {/* Quick Beneficiaries Strip */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Recent Beneficiaries:</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_BENEFICIARIES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl text-left transition-all"
                  >
                    <div className={`w-7 h-7 rounded-full ${b.avatarBg} text-white text-[10px] font-bold flex items-center justify-center`}>
                      {b.initials}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{b.name}</p>
                      <p className="text-[10px] text-slate-400">{b.bankName.split(' ')[0]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields for Bank Transfer */}
            {transferType === 'bank' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SURESH KUMAR BHAWAR LAL"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent text-sm font-medium uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 38192019482"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Re-enter Account Number"
                      value={confirmAccount}
                      onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 ${
                        confirmAccount && confirmAccount !== accountNumber
                          ? 'border-red-400 focus:ring-red-400 bg-red-50'
                          : 'border-slate-300 focus:ring-[#8B0000]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Bank IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">11 characters (e.g. SBIN0001234)</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SBIN0001234 or HDFC0000240"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] text-sm font-mono uppercase"
                  />
                </div>

                {/* Popular Bank Chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Select Common Bank:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_BANKS.slice(0, 5).map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => handleSelectBank(b)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          bankName === b.name
                            ? 'bg-[#8B0000] text-white border-[#8B0000]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Fields for UPI Transfer */}
            {transferType === 'upi' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiary Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DURGA GOPAL DHAKARE"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] text-sm uppercase font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI ID / VPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. recipient@okhdfcbank or 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports Google Pay, PhonePe, Paytm, Navi, BHIM, and all Bank UPIs
                  </p>
                </div>
              </div>
            )}

            {/* Amount Section */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount to Transfer (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  max={user.balance}
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#8B0000] text-2xl font-black text-slate-900 font-mono outline-none"
                />
              </div>

              {/* Quick Amount Suggestion Chips */}
              <div className="flex gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 text-xs py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors font-mono"
                  >
                    +₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {numAmount > user.balance && (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Amount exceeds available balance of ₹{user.balance.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Remark / Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remark / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Paid via Navi UPI, Rent, Bill, etc."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#8B0000] text-sm"
              />
            </div>

            {/* Mode selection & charges */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Mode:</span>
                <div className="flex gap-1">
                  {(['IMPS', 'UPI', 'NEFT'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        mode === m ? 'bg-[#8B0000] text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Transfer Charges:</span>{' '}
                <strong className="text-emerald-700 font-bold">₹0.00 (FREE)</strong>
              </div>
            </div>

            {/* Proceed button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isFormValid()
                    ? 'bg-[#8B0000] hover:bg-[#720000] text-white active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CONFIRMATION REVIEW */}
        {step === 'confirm' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Debit Amount
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1">
                ₹{numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <span className="inline-block mt-1 text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Zero Convenience Fee
              </span>
            </div>

            {/* Transfer breakdown card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <span className="text-slate-500">Debited From:</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    India Post Payments Bank - 8231
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                <span className="text-slate-500">Credited To:</span>
                <div className="text-right">
                  <p className="font-bold text-slate-900 uppercase">{recipientName}</p>
                  {transferType === 'bank' ? (
                    <>
                      <p className="text-slate-600 font-mono text-[11px]">
                        A/C: {accountNumber}
                      </p>
                      <p className="text-slate-400 font-mono text-[10px]">
                        IFSC: {ifsc} {bankName ? `(${bankName})` : ''}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-600 font-mono text-[11px]">{upiId}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transfer Mode:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {mode} (Instant 24x7)
                </span>
              </div>

              {remark && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Remark:</span>
                  <span className="font-medium text-slate-700 italic">"{remark}"</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 text-slate-600">
                <span>Balance After Transfer:</span>
                <span className="font-bold font-mono text-slate-900">
                  ₹{(user.balance - numAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToMpin}
                className="w-2/3 py-3 rounded-xl bg-[#8B0000] hover:bg-[#720000] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Verify MPIN & Pay</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MPIN VERIFICATION */}
        {step === 'mpin' && (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#8B0000] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900">Enter IPPB MPIN</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorizing payment of <strong className="text-slate-800 font-mono">₹{numAmount.toLocaleString('en-IN')}</strong> to {recipientName}
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center items-center gap-4 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all ${
                    enteredMpin.length > idx
                      ? 'bg-[#8B0000] scale-110 shadow'
                      : 'border-2 border-slate-300 bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {mpinError && (
              <p className="text-xs text-red-600 font-medium">{mpinError}</p>
            )}

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-600 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin text-[#8B0000]" />
                <span>Connecting to NPCI & Authorizing Transfer...</span>
              </div>
            ) : (
              <>
                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleMpinDigit(digit)}
                      className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-lg text-slate-800 shadow-sm transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      playKeypadClick();
                      setEnteredMpin('4444');
                      verifyMpinAndExecute('4444');
                    }}
                    title="Auto-fill 4444"
                    className="h-12 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#8B0000] font-bold text-xs"
                  >
                    Use 4444
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMpinDigit('0')}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-lg text-slate-800 shadow-sm"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleMpinDelete}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 font-bold text-sm text-slate-600 shadow-sm"
                  >
                    ⌫
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {step === 'success' && createdTxn && (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Payment Successful
              </span>
              <h2 className="text-3xl font-black text-slate-900 font-mono mt-3">
                ₹{createdTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sent to <strong className="text-slate-800 uppercase">{createdTxn.recipientOrSender}</strong>
              </p>
            </div>

            {/* Digital Receipt details box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">UPI Txn ID:</span>
                <span className="font-mono font-bold text-slate-900">{createdTxn.upiTxnId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Bank Ref (UTR):</span>
                <span className="font-mono font-semibold text-slate-800">{createdTxn.utrNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Debited From:</span>
                <span className="text-slate-900 font-medium">India Post Payments Bank - 8231</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-800">{createdTxn.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Updated Balance:</span>
                <span className="font-mono font-bold text-emerald-700">
                  ₹{(user.balance - createdTxn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print Receipt</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Send Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#720000] text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
