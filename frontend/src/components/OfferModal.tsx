'use client';

import React, { useState } from 'react';
import { Listing } from '@/types/marketplace';
import { enquiryService } from '@/services/api';
import { X, Send } from 'lucide-react';

interface OfferModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ listing, isOpen, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState<string>(
    listing.listingType === 'For Sale' ? String(listing.price) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please add a brief message for the seller.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await enquiryService.createEnquiry({
        listingId: listing._id,
        message: message.trim(),
        offerPrice: offerPrice ? Number(offerPrice) : null,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-slate-900 mb-1">Make an Offer / Enquire</h2>
        <p className="text-xs text-slate-500 mb-4">
          Contact the seller regarding: <span className="font-semibold text-slate-700">{listing.title}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {listing.listingType === 'For Sale' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Offer Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter asking or counter price"
                />
              </div>
              <span className="text-[11px] text-slate-500">Asking price: ₹{listing.price}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Message to Seller
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! Is this still available? Can we meet today near the library gate after 4 PM?"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send to Seller'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
