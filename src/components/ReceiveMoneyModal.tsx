import React, { useState } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, Crown } from 'lucide-react';
import { UserAccount } from '../types/banking';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [copiedUpi, setCopiedUpi] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(id);
    setTimeout(() => setCopiedUpi(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8C1D24] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-300" />
            <h3 className="font-bold text-sm">
              ICICI Bank iMobile QR & UPI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 text-[#8C1D24] border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1">
              <Crown className="w-3 h-3 text-amber-500" />
              Privilege Wealth Customer
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase">
              {user.name}
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ICICI Bank Ltd • A/C ...9412
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 border-2 border-dashed border-orange-300/80 rounded-3xl p-5 inline-block mx-auto shadow-inner relative group">
            {/* Visual SVG QR representation */}
            <svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer corners */}
              <rect x="15" y="15" width="50" height="50" rx="8" fill="#1e293b" />
              <rect x="25" y="25" width="30" height="30" rx="4" fill="white" />
              <rect x="33" y="33" width="14" height="14" rx="2" fill="#8C1D24" />

              <rect x="135" y="15" width="50" height="50" rx="8" fill="#1e293b" />
              <rect x="145" y="25" width="30" height="30" rx="4" fill="white" />
              <rect x="153" y="33" width="14" height="14" rx="2" fill="#8C1D24" />

              <rect x="15" y="135" width="50" height="50" rx="8" fill="#1e293b" />
              <rect x="25" y="145" width="30" height="30" rx="4" fill="white" />
              <rect x="33" y="153" width="14" height="14" rx="2" fill="#8C1D24" />

              {/* Data matrix dots */}
              <rect x="75" y="20" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="95" y="20" width="10" height="10" rx="2" fill="#F37021" />
              <rect x="115" y="35" width="10" height="10" rx="2" fill="#8C1D24" />
              <rect x="75" y="45" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="95" y="55" width="10" height="10" rx="2" fill="#1e293b" />
              
              <rect x="20" y="75" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="35" y="95" width="10" height="10" rx="2" fill="#F37021" />
              <rect x="55" y="75" width="10" height="10" rx="2" fill="#8C1D24" />
              <rect x="20" y="115" width="10" height="10" rx="2" fill="#1e293b" />

              {/* Center ICICI Logo badge */}
              <circle cx="100" cy="100" r="24" fill="#8C1D24" stroke="white" strokeWidth="3" />
              <text x="100" y="108" textAnchor="middle" fill="#F37021" fontSize="22" fontWeight="900" fontStyle="italic" fontFamily="serif">
                i
              </text>

              <rect x="135" y="75" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="155" y="95" width="10" height="10" rx="2" fill="#F37021" />
              <rect x="175" y="75" width="10" height="10" rx="2" fill="#8C1D24" />
              
              <rect x="75" y="135" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="95" y="155" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="115" y="135" width="10" height="10" rx="2" fill="#8C1D24" />
              <rect x="75" y="175" width="10" height="10" rx="2" fill="#F37021" />
              <rect x="95" y="175" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="145" y="145" width="10" height="10" rx="2" fill="#1e293b" />
              <rect x="165" y="165" width="10" height="10" rx="2" fill="#1e293b" />
            </svg>

            <span className="text-[10px] text-slate-500 font-bold block mt-1 tracking-wider uppercase">
              Scan with Any UPI App
            </span>
          </div>

          {/* UPI ID Copy boxes */}
          <div className="space-y-2 text-left">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Primary VPA (UPI ID)</span>
                <span className="text-xs font-mono font-bold text-slate-800">{user.upiId}</span>
              </div>
              <button
                onClick={() => handleCopy(user.upiId, 'upi1')}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                title="Copy"
              >
                {copiedUpi === 'upi1' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Secondary UPI</span>
                <span className="text-xs font-mono font-bold text-slate-800">{user.secondaryUpiId}</span>
              </div>
              <button
                onClick={() => handleCopy(user.secondaryUpiId, 'upi2')}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                title="Copy"
              >
                {copiedUpi === 'upi2' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">IFSC Code</span>
                <span className="text-xs font-mono font-bold text-slate-800">{user.ifsc}</span>
              </div>
              <button
                onClick={() => handleCopy(user.ifsc, 'ifsc')}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                title="Copy"
              >
                {copiedUpi === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Secure badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant RTGS / IMPS / UPI Credit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
