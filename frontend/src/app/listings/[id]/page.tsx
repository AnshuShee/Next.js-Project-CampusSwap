'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Listing } from '@/types/marketplace';
import { listingService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ListingCard } from '@/components/ListingCard';
import { OfferModal } from '@/components/OfferModal';
import { QRShareModal } from '@/components/QRShareModal';
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Loader2,
  PhoneCall,
  Mail,
} from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams() as { id: string };
  const { currentUser, toggleFavorite } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await listingService.getListingById(id);
      if (res.data.success) {
        setListing(res.data.listing);
        setSimilarListings(res.data.similarListings);
      }
    } catch (err) {
      console.error('Failed to load item:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  if (loading || !listing) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold">Loading listing details...</p>
      </div>
    );
  }

  const isOwner = currentUser?._id === listing.seller._id;
  const isFavorited = currentUser?.savedListings?.includes(listing._id) || false;

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.status === 'Reserved' && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Reserved by Another Student
                </div>
              )}
            </div>

            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900">About this Item</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Category</span>
                <span className="font-bold text-slate-800">{listing.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Condition</span>
                <span className="font-bold text-indigo-600">{listing.condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Listing Type</span>
                <span className="font-bold text-slate-800">{listing.listingType}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Location</span>
                <span className="font-bold text-slate-800">{listing.location}</span>
              </div>
            </div>

            {listing.listingType === 'Exchange' && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 font-semibold">
                Exchange Preference: {listing.exchangePreference || 'Open to relevant student trades'}
              </div>
            )}

            <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asking Price</span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {listing.listingType === 'For Sale' ? (
                  `₹${listing.price}`
                ) : listing.listingType === 'Free' ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  <span className="text-purple-600 text-2xl">Barter / Exchange</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                disabled={isOwner || listing.status === 'Sold'}
                onClick={() => setIsOfferModalOpen(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isOwner
                    ? 'You authored this listing'
                    : listing.status === 'Sold'
                    ? 'Item Sold'
                    : 'Make an Offer / Enquire'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleFavorite(listing._id)}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorited ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Meet in person inside campus premises for safe verification and payment.</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seller Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center">
                {listing.seller.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{listing.seller.name}</h4>
                <p className="text-xs text-slate-500">{listing.seller.department} • {listing.seller.year}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.seller.hostelOrLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                {listing.seller.contactPreference === 'WhatsApp' ? (
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Preferred: {listing.seller.contactPreference} ({listing.seller.phoneOrHandle || 'Listed upon offer'})</span>
              </div>
            </div>

            <Link
              href={`/profile/${listing.seller._id}`}
              className="block text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              View Seller Profile & History
            </Link>
          </div>
        </div>
      </div>

      {similarListings.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Similar Items in {listing.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {similarListings.map((sim) => (
              <ListingCard key={sim._id} listing={sim} />
            ))}
          </div>
        </div>
      )}

      <OfferModal
        listing={listing}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSuccess={() => alert('Your offer/enquiry was sent! Track status in your Dashboard.')}
      />

      <QRShareModal
        listingId={listing._id}
        listingTitle={listing.title}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
