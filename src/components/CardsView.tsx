import React, { useState } from 'react';
import { CreditCardData } from '../types/banking';
import { INITIAL_CREDIT_CARDS } from '../data/bankingExtensions';
import { CreditCard, Eye, EyeOff, ShieldCheck, Lock, Gift, ArrowUpRight, CheckCircle2, AlertTriangle, Sparkles, Smartphone, Globe, Wifi } from 'lucide-react';

interface CardsViewProps {
  onAttemptDebitAction: () => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ onAttemptDebitAction }) => {
  const [cards, setCards] = useState<CreditCardData[]>(INITIAL_CREDIT_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showSensitiveDetails, setShowSensitiveDetails] = useState(false);
  const [mpinInput, setMpinInput] = useState('');
  const [isMpinPromptOpen, setIsMpinPromptOpen] = useState(false);
  const [mpinError, setMpinError] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const currentCard = cards[activeCardIndex];

  const handleToggleCardControl = (field: 'isDomesticEnabled' | 'isInternationalEnabled' | 'isContactlessEnabled' | 'isCardFrozen') => {
    setCards(prev => prev.map((c, i) => {
      if (i === activeCardIndex) {
        const updated = { ...c, [field]: !c[field] };
        setActionSuccessMsg(`Security settings updated for ${c.cardName}`);
        setTimeout(() => setActionSuccessMsg(null), 3500);
        return updated;
      }
      return c;
    }));
  };

  const handleVerifyMpinForCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpinInput === '4444') {
      setShowSensitiveDetails(true);
      setIsMpinPromptOpen(false);
      setMpinInput('');
      setMpinError('');
    } else {
      setMpinError('Invalid MPIN. Please enter your 4-digit security PIN (4444)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3 rounded-2xl flex items-center gap-2 shadow-lg text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header & Card Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#8C1D24]" />
            <span>Cards Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage your Super-Premium Credit Cards & Linked Debit Cards
          </p>
        </div>
        <div className="flex gap-2">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => {
                setActiveCardIndex(idx);
                setShowSensitiveDetails(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCardIndex === idx
                  ? 'bg-[#8C1D24] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {card.cardName.includes('Emeralde') ? 'Emeralde Private' : 'Coral RuPay UPI'}
            </button>
          ))}
        </div>
      </div>

      {/* Credit Card Physical Preview */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-slate-950 via-stone-900 to-[#4d1115] text-white shadow-2xl border border-amber-500/20">
        {/* Metal shimmer & watermarks */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-56 sm:h-64">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-widest text-lg sm:text-xl text-amber-300">
                  ICICI BANK
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  Metal Edition
                </span>
              </div>
              <p className="text-xs text-stone-300 font-medium tracking-wide mt-0.5">
                {currentCard.cardName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-amber-200/80 rotate-90" />
              <span className="font-mono text-xs font-bold text-stone-400">
                {currentCard.cardType.split('/')[0]}
              </span>
            </div>
          </div>

          {/* EMV Chip & Card Number */}
          <div>
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center mb-4 border border-amber-100">
              <div className="w-full h-full border border-amber-800/40 rounded-[4px] grid grid-cols-2 opacity-75" />
            </div>

            <div className="flex items-center justify-between">
              <div className="font-mono text-lg sm:text-2xl font-bold tracking-[0.25em] text-amber-100">
                {showSensitiveDetails ? currentCard.cardNumberFull : currentCard.cardNumberMasked}
              </div>
              <button
                onClick={() => {
                  if (showSensitiveDetails) {
                    setShowSensitiveDetails(false);
                  } else {
                    setIsMpinPromptOpen(true);
                  }
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
                title={showSensitiveDetails ? 'Hide details' : 'View full number with MPIN'}
              >
                {showSensitiveDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card Holder & Expiry */}
          <div className="flex justify-between items-end text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono block">
                Cardholder Name
              </span>
              <span className="font-bold tracking-wider text-stone-100 text-sm">
                {currentCard.holderName}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono block">
                  Valid Thru
                </span>
                <span className="font-mono font-bold text-amber-200">
                  {currentCard.expiry}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono block">
                  CVV
                </span>
                <span className="font-mono font-bold text-amber-200">
                  {showSensitiveDetails ? currentCard.cvv : '•••'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Limit & Outstanding Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Credit Limit</p>
          <p className="text-xl font-black text-slate-900 mt-1">
            ₹{currentCard.creditLimit.toLocaleString('en-IN')}
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(currentCard.availableLimit / currentCard.creditLimit) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            ₹{currentCard.availableLimit.toLocaleString('en-IN')} Available
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Unbilled Spends</p>
          <p className="text-xl font-black text-amber-700 mt-1">
            ₹{currentCard.unbilledSpends.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Due Date: <strong className="text-slate-800">{currentCard.dueDate}</strong>
          </p>
          <button
            onClick={onAttemptDebitAction}
            className="mt-2 text-xs font-bold text-[#8C1D24] hover:underline flex items-center gap-1"
          >
            <span>Pay Credit Card Bill</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Handpicked Reward Points</p>
            <Gift className="w-4 h-4 text-[#F37021]" />
          </div>
          <p className="text-xl font-black text-[#F37021] mt-1">
            {currentCard.rewardPoints.toLocaleString('en-IN')} Pts
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Value: ₹{currentCard.rewardsValue.toLocaleString('en-IN')} (Redeemable for Taj Vouchers & Flights)
          </p>
        </div>
      </div>

      {/* Security & Card Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8C1D24]" />
          <span>Card Security & Usage Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Domestic Online Usage</span>
              </p>
              <p className="text-[11px] text-slate-500">E-Commerce & Digital Payments</p>
            </div>
            <button
              onClick={() => handleToggleCardControl('isDomesticEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                currentCard.isDomesticEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  currentCard.isDomesticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>International Usage</span>
              </p>
              <p className="text-[11px] text-slate-500">Cross-border transactions</p>
            </div>
            <button
              onClick={() => handleToggleCardControl('isInternationalEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                currentCard.isInternationalEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  currentCard.isInternationalEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-amber-600" />
                <span>Contactless Tap & Pay</span>
              </p>
              <p className="text-[11px] text-slate-500">Up to ₹5,000 without PIN</p>
            </div>
            <button
              onClick={() => handleToggleCardControl('isContactlessEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                currentCard.isContactlessEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  currentCard.isContactlessEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>Temporary Card Freeze</span>
              </p>
              <p className="text-[11px] text-slate-500">Instantly block new card charges</p>
            </div>
            <button
              onClick={() => handleToggleCardControl('isCardFrozen')}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                currentCard.isCardFrozen ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  currentCard.isCardFrozen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Linked Debit Card Status */}
      <div className="bg-red-50/50 border border-red-300 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-red-950 text-sm">
                ICICI Bank Rubyx Debit Card (Ending 9412)
              </p>
              <p className="text-xs text-red-800 mt-0.5">
                Linked to The Privilege Wealth Account <strong className="font-mono">000401589412</strong> (Kasif Shah)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-red-200 text-red-900 px-3 py-1 rounded-full uppercase tracking-wider">
              Debit Freeze Active
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-red-200/60">
          ATM cash withdrawals and POS card swipes are temporarily suspended in compliance with the high-inflow audit alert.
        </p>
      </div>

      {/* MPIN Verification Modal for Card Sensitive Details */}
      {isMpinPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8C1D24]" />
                <span>Enter 4-Digit MPIN</span>
              </h3>
              <button
                onClick={() => {
                  setIsMpinPromptOpen(false);
                  setMpinInput('');
                  setMpinError('');
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your ICICI iMobile MPIN to view your full 16-digit card number and CVV.
            </p>
            <form onSubmit={handleVerifyMpinForCard} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={mpinInput}
                onChange={(e) => setMpinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full text-center tracking-[1em] font-mono text-2xl py-3 border-2 border-slate-300 rounded-2xl focus:border-[#8C1D24] focus:outline-hidden"
              />
              {mpinError && <p className="text-xs text-red-600 font-semibold">{mpinError}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#8C1D24] text-white font-bold text-xs hover:bg-[#6e161c] transition-colors"
              >
                Authorize & Reveal Card Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
