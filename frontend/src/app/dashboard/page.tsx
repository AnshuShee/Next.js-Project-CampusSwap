'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Listing, Enquiry } from '@/types/marketplace';
import { listingService, enquiryService, authService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  Inbox,
  Send,
  Heart,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState<'myListings' | 'received' | 'sent' | 'favorites'>('myListings');

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [receivedEnquiries, setReceivedEnquiries] = useState<Enquiry[]>([]);
  const [sentEnquiries, setSentEnquiries] = useState<Enquiry[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsRes, receivedRes, sentRes, favsRes] = await Promise.all([
        listingService.getMyListings(),
        enquiryService.getReceivedEnquiries(),
        enquiryService.getSentEnquiries(),
        authService.getFavorites(),
      ]);

      if (listingsRes.data.success) setMyListings(listingsRes.data.listings);
      if (receivedRes.data.success) setReceivedEnquiries(receivedRes.data.enquiries);
      if (sentRes.data.success) setSentEnquiries(sentRes.data.enquiries);
      if (favsRes.data.success) setFavorites(favsRes.data.favorites);

      await enquiryService.markRead();
      refreshNotifications();
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchDashboardData();
  }, [currentUser]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await listingService.updateStatus(id, newStatus);
      setMyListings((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus as any } : item))
      );
    } catch (err) {
      alert('Could not update status');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await listingService.deleteListing(id);
      setMyListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert('Could not delete listing');
    }
  };

  const handleOfferResponse = async (enquiryId: string, status: 'Accepted' | 'Rejected') => {
    const note = prompt(`Optional reply note to student for ${status}:`) || '';
    try {
      await enquiryService.respondToEnquiry(enquiryId, { status, sellerReplyNote: note });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to respond to offer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your campus inventory, buyer negotiations, and track saved hostel items.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Listings</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{myListings.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reserved / Sold</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {myListings.filter((i) => i.status === 'Reserved' || i.status === 'Sold').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offers Received</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{receivedEnquiries.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Favorites</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{favorites.length}</div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('myListings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'myListings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'received'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Enquiries ({receivedEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Offers ({sentEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'favorites'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Items ({favorites.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">Updating dashboard records...</span>
        </div>
      ) : (
        <div>
          {activeTab === 'myListings' && (
            <div className="space-y-3">
              {myListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  <p className="text-xs">You haven't listed any items yet.</p>
                  <Link href="/sell" className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline">
                    Create your first listing →
                  </Link>
                </div>
              ) : (
                myListings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <Link href={`/listings/${item._id}`} className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition">
                          {item.title}
                        </Link>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-slate-700">₹{item.price}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                            {item.condition}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                          item.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Reserved'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Sold">Sold</option>
                        <option value="Inactive">Inactive</option>
                      </select>

                      <button
                        onClick={() => handleDeleteListing(item._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'received' && (
            <div className="space-y-3">
              {receivedEnquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  <p className="text-xs">No buyer enquiries or offers received yet.</p>
                </div>
              ) : (
                receivedEnquiries.map((enq) => (
                  <div key={enq._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          Offer on: {enq.listing?.title}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          From: {enq.buyer?.name} ({enq.buyer?.department})
                        </h4>
                        <p className="text-xs text-slate-500">
                          {enq.buyer?.hostelOrLocation} • {enq.buyer?.contactPreference}: {enq.buyer?.phoneOrHandle || 'Listed upon accept'}
                        </p>
                      </div>

                      <div className="text-right">
                        {enq.offerPrice !== null ? (
                          <div className="text-base font-black text-indigo-700">₹{enq.offerPrice}</div>
                        ) : (
                          <span className="text-xs text-slate-400">General Enquiry</span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            enq.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700'
                              : enq.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic">
                      "{enq.message}"
                    </div>

                    {enq.status === 'Pending' && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleOfferResponse(enq._id, 'Rejected')}
                          className="px-3 py-1.5 border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleOfferResponse(enq._id, 'Accepted')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept Offer (Reserve Item)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="space-y-3">
              {sentEnquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  <p className="text-xs">You haven't enquired on any student items yet.</p>
                </div>
              ) : (
                sentEnquiries.map((enq) => (
                  <div key={enq._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Seller: {enq.seller?.name} ({enq.seller?.hostelOrLocation})
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          {enq.listing?.title}
                        </h4>
                      </div>

                      <div className="text-right">
                        {enq.offerPrice && <span className="font-bold text-sm text-slate-900">Offered: ₹{enq.offerPrice}</span>}
                        <div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                              enq.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                                : enq.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                      My note: "{enq.message}"
                    </p>

                    {enq.sellerReplyNote && (
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900">
                        <span className="font-bold block">Seller's Response:</span>
                        {enq.sellerReplyNote}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favorites.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  <p className="text-xs">No saved favorites yet. Click the heart icon on any card to save it.</p>
                </div>
              ) : (
                favorites.map((item) => {
                  const isAvailable = item.status === 'Available';
                  return (
                    <div
                      key={item._id}
                      className={`bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm transition ${
                        isAvailable ? 'border-slate-200' : 'border-slate-300 bg-slate-50 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/listings/${item._id}`} className="font-bold text-sm text-slate-900 hover:text-indigo-600">
                              {item.title}
                            </Link>
                            {!isAvailable && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {item.status === 'Sold' ? 'Sold' : 'No Longer Available'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            ₹{item.price} • {item.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/listings/${item._id}`}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
