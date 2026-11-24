'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';

interface QRShareModalProps {
  listingId: string;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRShareModal: React.FC<QRShareModalProps> = ({ listingId, listingTitle, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/listings/${listingId}` : '';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-slate-900">Share with Campus</h3>
        <p className="text-xs text-slate-500 mb-4 px-2 line-clamp-1">{listingTitle}</p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrApiUrl} alt="Listing QR Code" className="w-48 h-48 mx-auto" />
        </div>
        <p className="text-[11px] text-slate-500 mb-4">
          Scan to open listing or print and paste on your hostel noticeboard!
        </p>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
};
