'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types/marketplace';
import { useAuth } from '@/context/AuthContext';
import { Heart, MapPin } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, isFavorited = false, onFavoriteToggle }) => {
  const { toggleFavorite } = useAuth();

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(listing._id);
    if (onFavoriteToggle) onFavoriteToggle(listing._id);
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'New': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Like New': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Good': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const imageSrc =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <Link
      href={`/listings/${listing._id}`}
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {listing.status === 'Reserved' && (
          <div className="absolute inset-0 bg-amber-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-amber-500 text-white font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Reserved
            </span>
          </div>
        )}

        {listing.status === 'Sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-slate-100 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-slate-600">
              Sold Out
            </span>
          </div>
        )}

        <button
          onClick={handleHeartClick}
          aria-label="Save to favorites"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500 shadow-sm transition hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex gap-1">
          {listing.listingType === 'Free' ? (
            <span className="bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
              FREE
            </span>
          ) : listing.listingType === 'Exchange' ? (
            <span className="bg-purple-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
              EXCHANGE
            </span>
          ) : (
            <span className="bg-slate-900/80 backdrop-blur text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
              FOR SALE
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-indigo-600">{listing.category}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getConditionColor(listing.condition)}`}>
              {listing.condition}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition">
            {listing.title}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 mt-1 mb-3">
            {listing.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
            <div>
              {listing.listingType === 'For Sale' ? (
                <span className="text-lg font-black text-slate-900">₹{listing.price}</span>
              ) : listing.listingType === 'Free' ? (
                <span className="text-lg font-black text-emerald-600">₹0 (Free)</span>
              ) : (
                <span className="text-xs font-bold text-purple-700 truncate max-w-[150px] inline-block">
                  Trade: {listing.exchangePreference || 'Open'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[120px]">{listing.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
