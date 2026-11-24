'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Listing } from '@/types/marketplace';
import { authService } from '@/services/api';
import { ListingCard } from '@/components/ListingCard';
import {
  MapPin,
  Mail,
  PhoneCall,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function PublicProfilePage() {
  const { id } = useParams() as { id: string };

  const [profile, setProfile] = useState<User | null>(null);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [soldListings, setSoldListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await authService.getProfile(id);
        if (res.data.success) {
          setProfile(res.data.profile);
          setActiveListings(res.data.activeListings);
          setSoldListings(res.data.soldListings);
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  if (loading || !profile) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-semibold">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg">
          {profile.name.charAt(0)}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified Campus Student</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{profile.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile.department} • {profile.year}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {profile.hostelOrLocation}
            </span>
            <span className="flex items-center gap-1.5">
              {profile.contactPreference === 'WhatsApp' ? (
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              ) : (
                <Mail className="w-4 h-4 text-blue-600" />
              )}
              Prefers {profile.contactPreference}: {profile.phoneOrHandle || profile.email}
            </span>
          </div>
        </div>

        <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div>
            <div className="text-2xl font-black text-indigo-600">{activeListings.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active</div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{soldListings.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Completed</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">Current Listings ({activeListings.length})</h2>
        {activeListings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
            This student has no active items listed right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {activeListings.map((item) => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        )}
      </div>

      {soldListings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-black text-slate-900">Past Completed Sales ({soldListings.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {soldListings.map((item) => (
              <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400">Sold for ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
